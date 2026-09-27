"""
AI Chatbot using Groq
Context-aware assistant for AtmosAi platform.
"""

from groq import Groq
from ..core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

SYSTEM_PROMPT = """You are AtmosAi Assistant — an AI helper for the AtmosAi platform (SIH26073) monitoring India's Automatic Weather Stations (AWS).

## YOUR ROLE
Help users understand:
1. How AtmosAi works (dashboard, stations, anomaly detection)
2. Current status of AWS stations
3. Types of anomalies: spikes, freezes, drift, dropouts
4. AI explainability and trust scores
5. Recommended actions for station operators

## RULES
1. Answer the exact question asked.
2. Use the CONTEXT provided about stations and anomalies.
3. Be concise (2-4 sentences for simple questions).
4. Never invent data.
5. Use domain terms: AWS, QC (Quality Control), SHAP, trust score, anomaly type.

## TONE
Professional, technical, helpful — like a senior meteorologist.
"""


def build_context_note(context: dict) -> str:
    if not context:
        return ""
    
    lines = ["## CURRENT CONTEXT"]
    
    if context.get("total_stations"):
        lines.append(f"- Total stations: {context['total_stations']}")
    if context.get("total_anomalies"):
        lines.append(f"- Total anomalies: {context['total_anomalies']}")
    if context.get("by_type"):
        types = ", ".join(f"{k}: {v}" for k, v in context["by_type"].items())
        lines.append(f"- Anomaly breakdown: {types}")
    if context.get("selected_station"):
        s = context["selected_station"]
        lines.append(f"- Currently viewing: {s.get('name')} in {s.get('state')}")
    
    return "\n".join(lines)


def get_chat_response(message: str, history: list = None, context: dict = None) -> dict:
    if not client:
        return {"reply": "", "error": "GROQ_API_KEY not configured"}
    
    history = history or []
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    ctx = build_context_note(context)
    if ctx:
        messages.append({"role": "system", "content": ctx})
    
    for turn in history[-6:]:
        if turn.get("role") in ("user", "assistant") and turn.get("content"):
            messages.append({"role": turn["role"], "content": turn["content"]})
    
    messages.append({"role": "user", "content": message})
    
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=400,
        )
        reply = response.choices[0].message.content.strip()
        return {"reply": reply, "error": None}
    except Exception as e:
        return {"reply": "", "error": f"Chat failed: {str(e)}"}