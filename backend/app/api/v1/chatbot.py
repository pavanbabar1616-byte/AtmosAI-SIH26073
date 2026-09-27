from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ...services.chatbot import get_chat_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[Dict[str, Any]] = None


@router.post("/chat")
def chat(request: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in (request.history or [])]
    return get_chat_response(request.message, history, request.context)


@router.get("/status")
def status():
    from ...core.config import settings
    return {
        "configured": bool(settings.GROQ_API_KEY),
        "model": settings.GROQ_MODEL,
    }