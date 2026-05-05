"""
Multi-Agent Product System - FastAPI Server
=========================================
Production Grade REST API
SOC 2 Compliant with JWT Authentication
"""

import hashlib
import hmac
import time
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import uuid

from multi_agent_system.core import Orchestrator, AgentType, MessageType, Priority, rate_limiter, validator, logger, config

# =============================================================================
# AUTHENTICATION (JWT)
# =============================================================================

SECURITY = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600

# User database (in production, use proper DB)
USERS = {
    "admin": {
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
        "role": "admin"
    },
    "viewer": {
        "password_hash": hashlib.sha256("viewer123".encode()).hexdigest(), 
        "role": "viewer"
    }
}

def create_token(username: str, role: str) -> str:
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now() + timedelta(seconds=config.SESSION_TIMEOUT),
        "iat": datetime.now()
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(SECURITY)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(role: str):
    def role_checker(payload: dict = Depends(verify_token)):
        if payload.get("role") not in ["admin", role]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return payload
    return role_checker

# =============================================================================
# FASTAPI APP
# =============================================================================

app = FastAPI(title="Multi-Agent Product System API", description="Production Grade Multi-Agent System - Idea to $1M ARR", version="1.0.0")

# Middleware
app.add_middleware(CORSMiddleware, allow_origins=config.ALLOWED_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Global orchestrator
_orchestrator = None

def get_orchestrator() -> Orchestrator:
    global _orchestrator
    if _orchestrator is None: _orchestrator = Orchestrator()
    return _orchestrator

# =============================================================================
# MODELS
# =============================================================================

class TaskRequest(BaseModel):
    agent_id: str
    action: str
    payload: dict = {}

class FlowRequest(BaseModel):
    idea: Optional[dict] = None

class MessageRequest(BaseModel):
    sender: str
    receiver: str
    message_type: str
    task_id: Optional[str] = None
    payload: dict = {}

class TaskUpdateRequest(BaseModel):
    status: Optional[str] = None

# =============================================================================
# HEALTH
# =============================================================================

@app.post("/api/auth/login")
def login(req: LoginRequest):
    """Login endpoint - returns JWT token"""
    user = USERS.get(req.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    password_hash = hashlib.sha256(req.password.encode()).hexdigest()
    if password_hash != user["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(req.username, user["role"])
    logger.audit("LOGIN", req.username, "auth", "login", "SUCCESS", {})
    
    return TokenResponse(access_token=token)


@app.get("/api/auth/me")
def get_me(payload: dict = Depends(verify_token)):
    """Get current user info"""
    return {"username": payload.get("sub"), "role": payload.get("role")}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "multi-agent-product-system", "version": "1.0.0"}


@app.get("/")
def root():
    return {"service": "Multi-Agent Product System API", "version": "1.0.0", "docs": "/docs"}

# =============================================================================
# AGENTS (Protected)
# =============================================================================

@app.get("/api/agents")
def list_agents(payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    result = {}
    for agent_id, agent in orch.agents.items():
        state = orch.message_queue.get_agent_state(agent_id)
        result[agent_id] = {
            "agent_id": agent.agent_id,
            "description": agent.description,
            "status": state.status if state else "IDLE",
        }
    return result

@app.get("/api/agents/{agent_id}")
def get_agent(agent_id: str, payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    agent = orch.agents.get(agent_id)
    if not agent: raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
    state = orch.message_queue.get_agent_state(agent_id)
    return {"agent_id": agent.agent_id, "description": agent.description, "status": state.status if state else "IDLE", "current_task": state.current_task if state else None}

# =============================================================================
# TASKS
# =============================================================================

@app.post("/api/tasks")
def create_task(req: TaskRequest, payload: dict = Depends(verify_token)):
    # Rate limit
    if not rate_limiter.check("api_taks"): raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    # Validate
    if not validator.validate_agent(req.agent_id): raise HTTPException(status_code=400, detail=f"Invalid agent: {req.agent_id}")
    
    orch = get_orchestrator()
    try:
        result = orch.execute_task(agent_id=req.agent_id, action=req.action, payload=req.payload)
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks")
def list_tasks(payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    return [{"task_id": t.task_id, "title": t.title, "assigned_agent": t.assigned_agent, "status": t.status.value, "priority": t.priority.value, "created_at": t.created_at} for t in orch.tasks.values()]

# =============================================================================
# FLOW
# =============================================================================

@app.post("/api/flow")
def run_flow(req: FlowRequest = None, payload: dict = Depends(verify_token)):
    if not rate_limiter.check("api_flow"): raise HTTPException(status_code=429, detail="Rate limit exceeded")
    orch = get_orchestrator()
    try:
        results = orch.run_full_flow()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/flow")
def get_flow_results(payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    return orch.run_full_flow()

# =============================================================================
# MESSAGES
# =============================================================================

@app.get("/api/messages")
def list_messages(agent_id: str = None, task_id: str = None, limit: int = 100, payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    messages = orch.get_messages()
    if agent_id: messages = [m for m in messages if m.get("sender", {}).get("agent_id") == agent_id or m.get("receiver", {}).get("agent_id") == agent_id]
    if task_id: messages = [m for m in messages if m.get("task_id") == task_id]
    return messages[-limit:]

@app.post("/api/messages")
def send_message(req: MessageRequest, payload: dict = Depends(verify_token)):
    try: msg_type = MessageType(req.message_type)
    except ValueError: raise HTTPException(status_code=400, detail=f"Invalid message type: {req.message_type}")
    orch = get_orchestrator()
    try:
        message = orch.message_queue.send(sender=req.sender, receiver=req.receiver, message_type=msg_type, task_id=req.task_id, payload=req.payload)
        return {"status": "sent", "message_id": message.message_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# METRICS
# =============================================================================

@app.get("/api/metrics")
def get_metrics(payload: dict = Depends(verify_token)):
    if not rate_limiter.check("api_metrics"): raise HTTPException(status_code=429, detail="Rate limit exceeded")
    orch = get_orchestrator()
    results = orch.run_full_flow()
    return results.get("metrics", {})

# =============================================================================
# STATE
# =============================================================================

@app.get("/api/state")
def get_state(payload: dict = Depends(verify_token)):
    orch = get_orchestrator()
    return {"agents": orch.get_agent_states(), "messages_count": len(orch.get_messages())}

# =============================================================================
# RUN
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)