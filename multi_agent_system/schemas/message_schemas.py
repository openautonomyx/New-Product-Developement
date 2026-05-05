"""Message schemas following AGENT_COMMUNICATION_PROTOCOL.md"""

from datetime import datetime
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class MessageType(str, Enum):
    TASK_REQUEST = "TASK_REQUEST"
    TASK_RESPONSE = "TASK_RESPONSE"
    TOOL_REQUEST = "TOOL_REQUEST"
    TOOL_RESPONSE = "TOOL_RESPONSE"
    CLARIFICATION_REQUEST = "CLARIFICATION_REQUEST"
    ERROR = "ERROR"
    DISCUSSION = "DISCUSSION"


class Priority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Status(str, Enum):
    SUCCESS = "SUCCESS"
    IN_PROGRESS = "IN_PROGRESS"
    FAILED = "FAILED"
    PENDING = "PENDING"


class AgentInfo(BaseModel):
    agent_id: str
    framework: str = "CrewAI"


class MessageSender(BaseModel):
    agent_id: str
    framework: str = "CrewAI"


class MessageReceiver(BaseModel):
    agent_id: str
    type: str = "system"


class Artifact(BaseModel):
    type: str
    path: str


class MessageMetadata(BaseModel):
    execution_time: str | None = None
    tokens_used: int | None = None


class Message(BaseModel):
    """Standard Message Schema (msg_schema_v1)"""
    message_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    sender: MessageSender
    receiver: MessageReceiver
    message_type: MessageType
    task_id: str | None = None
    status: Status = Status.SUCCESS
    priority: Priority = Priority.MEDIUM
    payload: dict[str, Any] = Field(default_factory=dict)
    next_actions: list[str] = Field(default_factory=list)
    errors: list[dict] | None = None
    metadata: MessageMetadata | None = None


class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class TaskInput(BaseModel):
    prd_section: str | None = None
    requirements: list[str] = Field(default_factory=list)


class TaskExpectedOutput(BaseModel):
    type: str
    format: str


class Task(BaseModel):
    """Task Schema (task_schema_v1)"""
    task_id: str
    title: str
    assigned_agent: str
    priority: Priority = Priority.MEDIUM
    dependencies: list[str] = Field(default_factory=list)
    input: TaskInput = Field(default_factory=TaskInput)
    expected_output: TaskExpectedOutput | None = None
    deadline: datetime | None = None
    status: TaskStatus = TaskStatus.PENDING


class AgentState(BaseModel):
    """Agent State Model (agent_state_v1)"""
    agent_id: str
    current_task: str | None = None
    status: str = "IDLE"
    memory_refs: list[str] = Field(default_factory=list)
    last_updated: datetime = Field(default_factory=datetime.now)


class ToolInput(BaseModel):
    query: str | None = None
    stars: str | None = None
    # Additional tool-specific parameters
    extra: dict[str, Any] = Field(default_factory=dict)


class ToolInvocation(BaseModel):
    """Tool Invocation Schema (tool_schema_v1)"""
    tool_name: str
    requested_by: str
    input: ToolInput = Field(default_factory=ToolInput)
    output_format: str = "json"


class ConversationParticipant(BaseModel):
    agent_id: str


class Conversation(BaseModel):
    """Conversation Schema (conversation_schema_v1)"""
    conversation_id: str
    participants: list[str]
    goal: str
    max_turns: int = 6
    termination_condition: str


class ErrorDetails(BaseModel):
    """Error Schema (error_schema_v1)"""
    message_type: MessageType = MessageType.ERROR
    task_id: str | None = None
    error_type: str
    description: str
    retryable: bool = True
    suggested_action: str | None = None