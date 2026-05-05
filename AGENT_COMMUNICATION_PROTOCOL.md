# Agent Communication Protocol & Message Schema


---


## 1. Core Principles


### 1.1 Structured Communication Only


* No free-form chatting between agents
* All messages must follow a **strict schema**


### 1.2 Task-Driven Messaging


* Every message must relate to:


  * A task
  * A result
  * A decision


### 1.3 Single Source of Truth


* CrewAI (or orchestrator) is the **message router**
* Agents do NOT directly communicate unless explicitly allowed


---


## 2. Communication Model


### Default Flow


```
Agent A → Orchestrator → Agent B
```


### Exception (Controlled)


```
Agent A ↔ Agent B (via AutoGen session, triggered by orchestrator)
```


---


## 3. Message Types


### 3.1 TASK_REQUEST


Assigns work to an agent


### 3.2 TASK_RESPONSE


Returns result of a task


### 3.3 TOOL_REQUEST


Agent requests tool execution


### 3.4 TOOL_RESPONSE


Tool returns output


### 3.5 CLARIFICATION_REQUEST


Agent needs more info


### 3.6 ERROR


Failure or exception


### 3.7 DISCUSSION


Used only inside AutoGen sessions


---


## 4. Standard Message Schema (JSON)


```json id="msg_schema_v1"
{
  "message_id": "uuid",
  "timestamp": "ISO-8601",
  "sender": {
    "agent_id": "engineering_agent",
    "framework": "CrewAI"
  },
  "receiver": {
    "agent_id": "orchestrator",
    "type": "system"
  },
  "message_type": "TASK_RESPONSE",
  "task_id": "task_123",
  "status": "SUCCESS",
  "priority": "MEDIUM",
  "payload": {
    "summary": "MVP feature implemented",
    "details": {},
    "artifacts": [
      {
        "type": "code",
        "path": "/repo/app/feature.py"
      }
    ]
  },
  "next_actions": [
    "send_to_QA",
    "deploy_to_staging"
  ],
  "errors": null,
  "metadata": {
    "execution_time": "120s",
    "tokens_used": 4500
  }
}
```


---


## 5. Task Schema


```json id="task_schema_v1"
{
  "task_id": "task_123",
  "title": "Build login feature",
  "assigned_agent": "engineering_agent",
  "priority": "HIGH",
  "dependencies": ["task_101"],
  "input": {
    "prd_section": "auth",
    "requirements": []
  },
  "expected_output": {
    "type": "code",
    "format": "python"
  },
  "deadline": "ISO-8601",
  "status": "IN_PROGRESS"
}
```


---


## 6. Tool Invocation Schema


```json id="tool_schema_v1"
{
  "tool_name": "github_search",
  "requested_by": "research_agent",
  "input": {
    "query": "authentication system python",
    "stars": ">100"
  },
  "output_format": "list_of_repos"
}
```


---


## 7. Agent State Model


Each agent maintains:


```json id="agent_state_v1"
{
  "agent_id": "engineering_agent",
  "current_task": "task_123",
  "status": "WORKING",
  "memory_refs": ["vector_id_1"],
  "last_updated": "timestamp"
}
```


---


## 8. Conversation Protocol (AutoGen Only)


### Rules


* Must be initiated by orchestrator
* Must have:


  * defined goal
  * max turns
  * participating agents


### Schema


```json id="conversation_schema_v1"
{
  "conversation_id": "conv_001",
  "participants": ["engineering_agent", "qa_agent"],
  "goal": "Debug failing test cases",
  "max_turns": 6,
  "termination_condition": "bug_identified"
}
```


---


## 9. Error Handling Protocol


### Error Message Example


```json id="error_schema_v1"
{
  "message_type": "ERROR",
  "task_id": "task_123",
  "error_type": "INTEGRATION_FAILURE",
  "description": "Repo dependency conflict",
  "retryable": true,
  "suggested_action": "use_alternative_repo"
}
```


---


## 10. Guardrails


* Max message size enforced
* Max conversation turns enforced
* No agent self-assigning tasks
* All actions logged


---


## 11. Logging & Observability


Track:


* Task completion time
* Agent performance
* Failure rates
* Tool usage


---


## 12. Execution Flow Example


1. PM Agent → TASK_REQUEST (build feature)
2. Engineering → TOOL_REQUEST (GitHub API)
3. Tool → TOOL_RESPONSE
4. Engineering → TASK_RESPONSE
5. QA → TASK_REQUEST
6. QA → ERROR or SUCCESS
7. Orchestrator → next step


---


## 13. Key Outcome


* Deterministic communication
* Debuggable system
* Scalable multi-agent coordination


---