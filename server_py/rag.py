import os
from dotenv import load_dotenv
load_dotenv()

import numpy as np
from typing import List, Dict, Any, Optional, Callable
from dataclasses import dataclass
import srt
from datetime import timedelta
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

@dataclass
class Document:
    page_content: str
    metadata: Dict[str, Any]

class SimpleMemoryVectorStore:
    def __init__(self, embeddings: OpenAIEmbeddings):
        self.documents: List[Dict[str, Any]] = []
        self.embeddings = embeddings

    async def add_documents(self, documents: List[Document]):
        if not documents:
            return

        texts = [d.page_content for d in documents]
        try:
            vectors = await self.embeddings.aembed_documents(texts)
            for vector, doc in zip(vectors, documents):
                self.documents.append({"vector": vector, "document": doc})
        except Exception as e:
            print(f"Embedding failed (likely missing API key): {e}")

    async def similarity_search(
        self,
        query: str,
        k: int = 4,
        filter_fn: Optional[Callable[[Document], bool]] = None
    ) -> List[Document]:
        if not self.documents:
            return []

        try:
            query_vector = await self.embeddings.aembed_query(query)
        except Exception as e:
            print(f"Embedding failed (likely missing API key): {e}")
            return []

        scored_docs = []
        for item in self.documents:
            doc = item["document"]
            if filter_fn and not filter_fn(doc):
                continue
            score = self._cosine_similarity(query_vector, item["vector"])
            scored_docs.append({"document": doc, "score": score})

        scored_docs.sort(key=lambda x: x["score"], reverse=True)
        return [item["document"] for item in scored_docs[:k]]

    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        a_np = np.array(a)
        b_np = np.array(b)
        return float(np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np)))

    def clear(self):
        self.documents = []

class RAGSystem:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY", "dummy")

        self.embeddings = OpenAIEmbeddings(openai_api_key=api_key)
        self.vector_store = SimpleMemoryVectorStore(self.embeddings)
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0,
            openai_api_key=api_key
        )
        self.content_meta = {
            "max_season": 0,
            "max_episode": 0,
            "max_timestamp": 0
        }
        # Track max timestamp per (content_id, season, episode)
        self.episode_timestamps: Dict[tuple, int] = {}
        # Content registry: {content_id: {universe, type, title, items: [...]}}
        self.content_registry: Dict[str, dict] = {}

    def register_content(self, content_id: str, universe: str, content_type: str,
                         title: str, season: int, episode: int,
                         item_title: str, max_ts: int):
        """Register a content item (movie or series episode) in the registry."""
        if content_id not in self.content_registry:
            self.content_registry[content_id] = {
                "universe": universe,
                "type": content_type,
                "title": title,
                "items": []
            }
        self.content_registry[content_id]["items"].append({
            "season": season,
            "episode": episode,
            "title": item_title,
            "maxTimestamp": max_ts
        })
        # Track per-(content_id, season, episode) max timestamp
        key = (content_id, season, episode)
        current_max = self.episode_timestamps.get(key, 0)
        if max_ts > current_max:
            self.episode_timestamps[key] = max_ts

    async def ingest_text(self, text: str, metadata: Dict[str, Any]):
        import time
        doc = Document(
            page_content=text,
            metadata={
                **metadata,
                "content_id": metadata.get("content_id", ""),
                "id": f"{metadata.get('content_id', '')}-{metadata['season']}-{metadata['episode']}-{metadata['timestamp']}-{int(time.time() * 1000)}"
            }
        )
        await self.vector_store.add_documents([doc])

    async def ingest_srt(self, srt_content: str, season: int, episode: int,
                         content_id: str = "") -> int:
        try:
            subtitles = list(srt.parse(srt_content))
        except Exception as e:
            print(f"SRT parsing failed: {e}")
            return 0

        max_timestamp_in_file = 0
        documents = []

        for sub in subtitles:
            seconds = sub.start.total_seconds()
            if seconds > max_timestamp_in_file:
                max_timestamp_in_file = seconds

            if sub.content.strip():
                documents.append(Document(
                    page_content=sub.content,
                    metadata={
                        "content_id": content_id,
                        "season": season,
                        "episode": episode,
                        "timestamp": seconds,
                        "id": sub.index,
                        "startTime": str(sub.start),
                        "endTime": str(sub.end)
                    }
                ))

        if season > self.content_meta["max_season"]:
            self.content_meta["max_season"] = season
        if episode > self.content_meta["max_episode"]:
            self.content_meta["max_episode"] = episode
        if max_timestamp_in_file > self.content_meta["max_timestamp"]:
            self.content_meta["max_timestamp"] = max_timestamp_in_file

        # Track per-(content_id, season, episode) max timestamp
        key = (content_id, season, episode)
        current_max = self.episode_timestamps.get(key, 0)
        if int(max_timestamp_in_file) > current_max:
            self.episode_timestamps[key] = int(max_timestamp_in_file)

        await self.vector_store.add_documents(documents)
        return len(documents)

    def get_content_info(self, content_id: str = "", season: int = 1, episode: int = 1) -> Dict[str, Any]:
        if content_id and content_id in self.content_registry:
            reg = self.content_registry[content_id]
            items = reg["items"]
            max_season = max((i["season"] for i in items), default=0)
            max_episode = max((i["episode"] for i in items if i["season"] == season), default=0)
            key = (content_id, season, episode)
            episode_max = self.episode_timestamps.get(key, 0)
            # Build episode timestamps for this content_id
            ep_ts = {f"{k[1]}-{k[2]}": v for k, v in self.episode_timestamps.items() if k[0] == content_id}
            is_movie = reg["type"] == "movies"
            return {
                "isMovie": is_movie,
                "hasContent": len(items) > 0,
                "maxSeason": max_season,
                "maxEpisode": max_episode,
                "maxTimestamp": episode_max,
                "episodeTimestamps": ep_ts
            }
        # Fallback to global
        has_content = self.content_meta["max_timestamp"] > 0
        is_movie = has_content and self.content_meta["max_season"] == 1 and self.content_meta["max_episode"] == 1
        key = (content_id, season, episode) if content_id else ("", season, episode)
        episode_max = self.episode_timestamps.get(key, int(self.content_meta["max_timestamp"]))
        return {
            "isMovie": is_movie,
            "hasContent": has_content,
            "maxSeason": self.content_meta["max_season"],
            "maxEpisode": self.content_meta["max_episode"],
            "maxTimestamp": episode_max,
            "episodeTimestamps": {f"{k[1]}-{k[2]}": v for k, v in self.episode_timestamps.items() if k[0] == content_id}
        }

    def get_content(self) -> list:
        """Return all universes with their content for the /api/content endpoint."""
        universes: Dict[str, list] = {}
        for content_id, reg in self.content_registry.items():
            universe_name = reg["universe"]
            if universe_name not in universes:
                universes[universe_name] = []
            universes[universe_name].append({
                "content_id": content_id,
                "type": reg["type"],
                "title": reg["title"],
                "items": sorted(reg["items"], key=lambda i: (i["season"], i["episode"]))
            })
        return [
            {"name": name, "content": content_list}
            for name, content_list in sorted(universes.items())
        ]

    def get_movies(self) -> list:
        """Backward-compatible: return flat list of all movie items across all content."""
        movies = []
        for content_id, reg in self.content_registry.items():
            for item in sorted(reg["items"], key=lambda i: (i["season"], i["episode"])):
                movies.append({
                    "episode": item["episode"],
                    "title": item["title"],
                    "maxTimestamp": item["maxTimestamp"],
                    "content_id": content_id
                })
        return movies

    def _lookup_item_title(self, content_id: str, season: int, episode: int) -> Optional[str]:
        """Look up the human-readable title for a content item."""
        reg = self.content_registry.get(content_id)
        if not reg:
            return None
        for item in reg["items"]:
            if item["season"] == season and item["episode"] == episode:
                return item["title"]
        return None

    def _format_source_label(self, doc: Document) -> str:
        """Format a human-readable source label for a document."""
        m = doc.metadata
        content_id = m.get("content_id", "")
        season = m["season"]
        episode = m["episode"]
        time_str = m.get("startTime", str(int(m["timestamp"])) + "s")

        reg = self.content_registry.get(content_id)
        item_title = self._lookup_item_title(content_id, season, episode)

        if reg and reg["type"] == "movies":
            label = item_title or f"Movie {episode}"
            return f"[{label}, {time_str}]"
        else:
            series_title = reg["title"] if reg else f"S{season:02d}"
            if item_title:
                return f"[{series_title} S{season}E{episode} - {item_title}, {time_str}]"
            return f"[{series_title} S{season}E{episode}, {time_str}]"

    async def query(
        self,
        question: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        effective_timestamp = context["timestamp"]
        content_id = context.get("content_id", "")
        if context["episode"] > 1 and effective_timestamp < 60:
            effective_timestamp = 99999
            print(f"[RAG] Adjusting timestamp from {context['timestamp']} to {effective_timestamp} for episode {context['episode']}")

        print(f"[RAG] Query context: {question}, {context} (effective_timestamp={effective_timestamp})")

        def filter_fn(doc: Document) -> bool:
            m = doc.metadata
            # Filter by content_id first
            if content_id and m.get("content_id", "") != content_id:
                return False
            if context.get("allow_spoilers"):
                return True
            if m["season"] < context["season"]:
                return True
            if m["season"] == context["season"] and m["episode"] < context["episode"]:
                return True
            if (m["season"] == context["season"] and
                m["episode"] == context["episode"] and
                m["timestamp"] <= effective_timestamp):
                return True
            return False

        results = await self.vector_store.similarity_search(question, k=10, filter_fn=filter_fn)
        print(f"[RAG] Found {len(results)} results within timestamp window (up to {effective_timestamp}s)")

        has_future_content = False
        if not results and not context.get("allow_spoilers"):
            def future_filter(doc: Document) -> bool:
                m = doc.metadata
                if content_id and m.get("content_id", "") != content_id:
                    return False
                return not filter_fn(doc)
            future_results = await self.vector_store.similarity_search(question, k=2, filter_fn=future_filter)
            if future_results:
                has_future_content = True
                print(f"[RAG] Spoiler content detected in {len(future_results)} future segments")

        if not results and has_future_content:
            return {
                "answer": "I found relevant information, but it's from a future point in the series. Please enable Spoiler Mode to see it.",
                "is_spoiler": True,
                "source_nodes": []
            }

        if not results:
            return {
                "answer": "I couldn't find any relevant information in the script so far.",
                "is_spoiler": False,
                "source_nodes": []
            }

        # Build dynamic system prompt based on content
        reg = self.content_registry.get(content_id)
        if reg and reg["type"] == "movies":
            content_hint = "Each excerpt shows the movie title and timestamp."
            items_desc = ", ".join(
                f"{item['title']} (movie {item['episode']})"
                for item in sorted(reg["items"], key=lambda i: i["episode"])
            )
            content_hint += f" Available movies: {items_desc}."
        elif reg:
            content_hint = f"You are answering about \"{reg['title']}\". Each excerpt shows [Series S#E#, timestamp]."
        else:
            content_hint = "Each excerpt shows the source and timestamp."

        system_prompt = f"""You are a helpful companion for someone watching a movie or TV show.
You have access to subtitle/dialogue excerpts from what they've watched so far.

GUIDELINES:
1. Base your answers primarily on the dialogue excerpts provided below
2. Be helpful! Use the dialogue to piece together what's happening - characters mentioned, conflicts, themes, etc.
3. For "what happens" questions, summarize based on what you can infer from the dialogue
4. {content_hint}
5. If asked about specific plot points not in the excerpts, say what you DO know from the dialogue and mention you don't have that specific detail

Be conversational and helpful - don't refuse to help when you have relevant dialogue to work with!"""

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("system", "Dialogue excerpts from the show:\n{context}"),
            ("user", "{question}")
        ])

        chain = prompt | self.llm | StrOutputParser()

        context_string = "\n\n".join([
            f"{self._format_source_label(doc)}: \"{doc.page_content}\""
            for doc in results
        ])

        print(f"[RAG] Context for query: {context_string[:500]}")

        try:
            answer = await chain.ainvoke({
                "context": context_string,
                "question": question
            })
        except Exception as e:
            print(f"LLM Generation failed: {e}")
            answer = f"Warning: OpenAI API Key missing or invalid. Context found: {results[0].page_content}"

        return {
            "answer": answer,
            "is_spoiler": False,
            "source_nodes": [r.metadata for r in results]
        }

    def reset(self):
        self.vector_store.clear()
        self.content_meta = {"max_season": 0, "max_episode": 0, "max_timestamp": 0}
        self.episode_timestamps = {}
        self.content_registry = {}

rag_system = RAGSystem()
