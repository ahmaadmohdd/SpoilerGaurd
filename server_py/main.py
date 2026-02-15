import os
import re
from fastapi import FastAPI, UploadFile, File, Form, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from .models import ChatRequest, ChatResponse, IngestLiveRequest, IngestResponse, ContentInfo
from .rag import rag_system

ALLOWED_ORIGIN_PATTERNS = [
    re.compile(r"^https://.*\.disneyplus\.com$"),
    re.compile(r"^https://.*\.netflix\.com$"),
    re.compile(r"^http://localhost"),
    re.compile(r"^chrome-extension://"),
]

SE_PATTERN = re.compile(r'S(\d+)E(\d+)|(\d+)x(\d+)', re.IGNORECASE)
YEAR_PATTERN = re.compile(r'(\d{4})')


def _read_file(filepath: str) -> str:
    """Read a file trying multiple encodings."""
    for enc in ("utf-8", "latin-1", "cp1252"):
        try:
            with open(filepath, "r", encoding=enc) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def _extract_se(match) -> tuple[int, int]:
    """Extract (season, episode) from an SE_PATTERN match (S01E01 or 1x01)."""
    if match.group(1) is not None:
        return int(match.group(1)), int(match.group(2))
    return int(match.group(3)), int(match.group(4))


def _make_title(filename: str) -> str:
    """Create a readable title from a filename."""
    name = os.path.splitext(filename)[0]
    # Strip S##E## prefix if present
    name = SE_PATTERN.sub('', name).strip('_').strip()
    return name.replace("_", " ")


def _slugify(name: str) -> str:
    """Create a content_id slug from a name."""
    return re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')


async def seed_data():
    """Scan attached_assets/ for universe folders and ingest content."""
    import glob

    base_dir = os.path.join(os.getcwd(), "attached_assets")
    if not os.path.isdir(base_dir):
        print("[Seed] No attached_assets/ directory found")
        return

    # Check for universe folders (subdirectories of attached_assets/)
    universe_dirs = []
    fallback_srts = []

    for entry in sorted(os.listdir(base_dir)):
        full_path = os.path.join(base_dir, entry)
        if os.path.isdir(full_path) and not entry.startswith('.'):
            universe_dirs.append((entry, full_path))
        elif entry.lower().endswith('.srt'):
            fallback_srts.append(full_path)

    # Fallback: bare .srt files in root → "Default" universe
    if not universe_dirs and fallback_srts:
        universe_dirs = [("Default", base_dir)]

    for universe_raw, universe_path in universe_dirs:
        universe_name = universe_raw.replace("_", " ")
        universe_slug = _slugify(universe_raw)
        print(f"[Seed] Scanning universe: {universe_name}")

        # Collect flat SRT files and subfolders
        flat_movies = []       # flat SRTs without S##E## → movies
        flat_series = []       # flat SRTs with S##E## → standalone series
        series_folders = []    # subfolders → named series

        for entry in sorted(os.listdir(universe_path)):
            full = os.path.join(universe_path, entry)
            if os.path.isdir(full) and not entry.startswith('.'):
                series_folders.append((entry, full))
            elif entry.lower().endswith('.srt'):
                se_match = SE_PATTERN.search(entry)
                if se_match:
                    s, e = _extract_se(se_match)
                    flat_series.append((full, entry, s, e))
                else:
                    year_match = YEAR_PATTERN.search(entry)
                    year = int(year_match.group(1)) if year_match else 0
                    flat_movies.append((full, entry, year))

        # --- Flat movies (no S##E##) ---
        if flat_movies:
            content_id = f"{universe_slug}_movies"
            flat_movies.sort(key=lambda x: x[2])  # sort by year
            for ep_num, (filepath, filename, year) in enumerate(flat_movies, start=1):
                title = _make_title(filename)
                try:
                    content = _read_file(filepath)
                    count = await rag_system.ingest_srt(content, 1, ep_num, content_id=content_id)
                    max_ts = rag_system.episode_timestamps.get((content_id, 1, ep_num), 0)
                    rag_system.register_content(
                        content_id=content_id,
                        universe=universe_name,
                        content_type="movies",
                        title=f"{universe_name} Movies",
                        season=1,
                        episode=ep_num,
                        item_title=title,
                        max_ts=max_ts
                    )
                    print(f"[Seed]   Movie {ep_num}: {title} - {count} segments")
                except Exception as e:
                    print(f"[Seed]   Failed to ingest {title}: {e}")

        # --- Flat series (S##E## in filename, no subfolder) ---
        if flat_series:
            content_id = universe_slug
            flat_series.sort(key=lambda x: (x[2], x[3]))  # sort by season, episode
            for filepath, filename, s, e in flat_series:
                title = _make_title(filename)
                try:
                    content = _read_file(filepath)
                    count = await rag_system.ingest_srt(content, s, e, content_id=content_id)
                    max_ts = rag_system.episode_timestamps.get((content_id, s, e), 0)
                    rag_system.register_content(
                        content_id=content_id,
                        universe=universe_name,
                        content_type="series",
                        title=universe_name,
                        season=s,
                        episode=e,
                        item_title=title or f"S{s:02d}E{e:02d}",
                        max_ts=max_ts
                    )
                    print(f"[Seed]   {universe_name} S{s:02d}E{e:02d}: {title} - {count} segments")
                except Exception as e_err:
                    print(f"[Seed]   Failed to ingest {filename}: {e_err}")

        # --- Subfolders → named series ---
        for folder_name, folder_path in series_folders:
            series_title = folder_name.replace("_", " ")
            content_id = f"{universe_slug}_{_slugify(folder_name)}"
            # Collect SRTs from this folder AND any nested subfolders (season dirs)
            all_srt_files = []
            for f in sorted(os.listdir(folder_path)):
                full = os.path.join(folder_path, f)
                if f.lower().endswith('.srt'):
                    all_srt_files.append((full, f))
                elif os.path.isdir(full) and not f.startswith('.'):
                    # Nested subfolder (e.g. "Daredevil_season 1")
                    for sf in sorted(os.listdir(full)):
                        if sf.lower().endswith('.srt'):
                            all_srt_files.append((os.path.join(full, sf), sf))
            for filepath, filename in all_srt_files:
                se_match = SE_PATTERN.search(filename)
                if se_match:
                    s, e = _extract_se(se_match)
                else:
                    s, e = 1, 1
                title = _make_title(filename)
                try:
                    content = _read_file(filepath)
                    count = await rag_system.ingest_srt(content, s, e, content_id=content_id)
                    max_ts = rag_system.episode_timestamps.get((content_id, s, e), 0)
                    rag_system.register_content(
                        content_id=content_id,
                        universe=universe_name,
                        content_type="series",
                        title=series_title,
                        season=s,
                        episode=e,
                        item_title=title or f"S{s:02d}E{e:02d}",
                        max_ts=max_ts
                    )
                    print(f"[Seed]   {series_title} S{s:02d}E{e:02d}: {title} - {count} segments")
                except Exception as e_err:
                    print(f"[Seed]   Failed to ingest {filename}: {e_err}")

    # Summary
    universes = rag_system.get_content()
    total = sum(len(c["items"]) for u in universes for c in u["content"])
    print(f"[Seed] Done: {len(universes)} universe(s), {total} total items")


def create_app(serve_static: bool = True) -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        await seed_data()
        yield

    app = FastAPI(title="Spoiler Guard API", lifespan=lifespan)

    @app.middleware("http")
    async def cors_and_csp_middleware(request: Request, call_next):
        origin = request.headers.get("origin", "")

        if request.method == "OPTIONS":
            response = Response(status_code=200)
        else:
            response = await call_next(request)

        is_allowed = any(pattern.match(origin) for pattern in ALLOWED_ORIGIN_PATTERNS)
        if is_allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type"

        response.headers["Content-Security-Policy"] = (
            "frame-ancestors 'self' https://*.disneyplus.com https://*.netflix.com "
            "http://localhost:* chrome-extension://*"
        )

        return response

    @app.post("/api/chat")
    async def chat_message(request: ChatRequest):
        response = await rag_system.query(request.question, {
            "season": request.season,
            "episode": request.episode,
            "timestamp": request.timestamp,
            "allow_spoilers": request.allow_spoilers,
            "content_id": request.content_id
        })

        result = ChatResponse(
            answer=response["answer"],
            is_spoiler=response["is_spoiler"],
            warning="Potential spoiler detected in future content." if response["is_spoiler"] else None,
            source_nodes=response.get("source_nodes", [])
        )
        return result.model_dump(exclude_none=True)

    @app.post("/api/ingest/live", response_model=IngestResponse)
    async def ingest_live(request: IngestLiveRequest):
        await rag_system.ingest_text(request.text, {
            "season": request.season,
            "episode": request.episode,
            "timestamp": request.timestamp,
            "content_id": request.content_id
        })
        return IngestResponse(success=True)

    @app.post("/api/ingest/file", response_model=IngestResponse)
    async def ingest_upload(
        file: UploadFile = File(...),
        season: int = Form(1),
        episode: int = Form(1)
    ):
        content = await file.read()
        srt_content = content.decode("utf-8")

        count = await rag_system.ingest_srt(srt_content, season, episode)

        return IngestResponse(
            success=True,
            chunks=count,
            message=f"Successfully ingested {count} subtitle segments for S{season}E{episode}"
        )

    @app.post("/api/ingest/reset", response_model=IngestResponse)
    async def ingest_reset():
        rag_system.reset()
        return IngestResponse(success=True, message="Knowledge base reset.")

    @app.post("/api/ingest/reload")
    async def ingest_reload():
        rag_system.reset()
        await seed_data()
        universes = rag_system.get_content()
        total = sum(len(c["items"]) for u in universes for c in u["content"])
        return {"success": True, "message": f"Reloaded {len(universes)} universe(s) with {total} items.", "count": total}

    @app.get("/api/content")
    async def get_content():
        return {"universes": rag_system.get_content()}

    @app.get("/api/content/info")
    async def content_info(content_id: str = "", season: int = 1, episode: int = 1):
        info = rag_system.get_content_info(content_id, season, episode)
        return info

    @app.get("/api/movies")
    async def get_movies():
        return rag_system.get_movies()

    if serve_static:
        static_dir = os.path.join(os.getcwd(), "dist", "public")
        if os.path.exists(static_dir):
            assets_dir = os.path.join(static_dir, "assets")
            if os.path.exists(assets_dir):
                app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

            @app.get("/{full_path:path}")
            async def serve_spa(full_path: str):
                file_path = os.path.join(static_dir, full_path)
                if os.path.isfile(file_path):
                    return FileResponse(file_path)
                return FileResponse(os.path.join(static_dir, "index.html"))

    return app

app = create_app(serve_static=True)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
