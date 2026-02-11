from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, List
from datetime import datetime

class ChatRequest(BaseModel):
    question: str
    season: int
    episode: int
    timestamp: int
    allow_spoilers: bool = False
    content_id: str = ""

class SourceNode(BaseModel):
    season: int
    episode: int
    timestamp: float
    id: Any
    startTime: Optional[str] = None
    endTime: Optional[str] = None

class ChatResponse(BaseModel):
    model_config = ConfigDict(exclude_none=True)
    
    answer: str
    is_spoiler: bool
    warning: Optional[str] = None
    source_nodes: List[SourceNode] = []

class IngestLiveRequest(BaseModel):
    text: str
    season: int
    episode: int
    timestamp: int
    source: Optional[str] = None
    isMovie: Optional[bool] = None
    title: Optional[str] = None
    content_id: str = ""

class IngestFileRequest(BaseModel):
    season: int = 1
    episode: int = 1

class IngestResponse(BaseModel):
    success: bool
    chunks: int = 0
    message: str = ""

class ContentInfo(BaseModel):
    isMovie: bool
    hasContent: bool
    maxSeason: int
    maxEpisode: int
    maxTimestamp: float
