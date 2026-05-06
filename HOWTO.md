# AgentForge How-To Guide

Complete guide to deploying and using the AgentForge multi-agent system.

---

## 🚀 Quick Start

### 1. Local Development

```bash
# Clone repository
git clone https://github.com/openautonomyx/New-Product-Developement.git
cd New-Product-Developement

# Install dependencies
pip install -r requirements.txt

# Run server
python enterprise.py

# Access UI
# Open http://localhost:8000/ui
```

### 2. Docker Deployment

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

---

## 🔐 Authentication

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "user_id": "usr_001",
    "username": "admin",
    "role": "admin"
  }
}
```

### Use Token

```bash
curl http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 👥 User Management

### Create User (Admin)

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"john",
    "password":"SecurePass123!",
    "email":"john@company.com",
    "role":"operator"
  }'
```

### Roles

| Role | Capabilities |
|------|-------------|
| `admin` | Manage tenants, users, full access |
| `operator` | Manage tasks, agents |
| `viewer` | Read-only |

---

## 📋 Task Management

### Create Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build API Integration",
    "description": "Add Stripe payment integration",
    "phase": "build"
  }'
```

### Task Phases

```
ideate → research → spec → build → test → launch → iterate
```

### List Tasks

```bash
curl http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>"
```

### Update Task

```bash
curl -X PUT http://localhost:8000/api/v1/tasks/tas_001 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

---

## 💬 Inter-Agent Messages

### Send Message

```bash
curl -X POST http://localhost:8000/api/v1/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "to_agent":"engineering",
    "content":"Please implement the API"
  }'
```

### Get Messages

```bash
curl http://localhost:8000/api/v1/messages?agent=engineering \
  -H "Authorization: Bearer <token>"
```

---

## 🔄 Workflow

### Get Current Phase

```bash
curl http://localhost:8000/api/v1/workflow \
  -H "Authorization: Bearer <token>"
```

### Advance Phase

```bash
curl -X PUT http://localhost:8000/api/v1/workflow/advance \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Research completed"}'
```

---

## 🏢 Multi-Tenant Setup

### Create Tenant

```bash
curl -X POST http://localhost:8000/api/v1/tenants \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","domain":"acme.com"}'
```

### Switch Tenant

```bash
# Include tenant_id in JWT - automatic isolation
# All queries filtered by tenant_id
```

---

## 🔧 Development

### Local Setup

```bash
# Virtual environment
python -m venv venv
source venv/bin/activate

# Install
pip install fastapi uvicorn pydantic python-jose

# Run
python enterprise.py

# API Docs: http://localhost:8000/docs
```

### Add Custom Agent

```python
class CustomAgent(BaseAgent):
    name = "custom"
    description = "Custom agent description"
    
    async def process(self, task):
        # Custom logic
        return {"result": "done"}
```

---

## 🐳 Docker

### Build

```bash
# Build image
docker build -t agentforge:latest .

# Tag for registry
docker tag agentforge:latest registry/agentforge:v1.0
```

### Run

```bash
# Basic
docker run -p 8000:8000 agentforge

# With environment
docker run -p 8000:8000 \
  -e JWT_SECRET_KEY=your-secret \
  -e DATABASE_URL=postgres://... \
  agentforge
```

### Compose

```bash
# Start stack
docker-compose up -d

# Scale API
docker-compose up -d --scale api=3

# Stop
docker-compose down
```

---

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:8000/health
```

### Metrics

```bash
curl http://localhost:8000/metrics
```

### Audit Logs

```bash
curl http://localhost:8000/api/v1/audit?limit=50 \
  -H "Authorization: Bearer <token>"
```

---

## 🔐 Security

### Password Requirements

- Minimum 8 characters
- 1 uppercase
- 1 lowercase
- 1 digit
- 1 special character

### Rate Limits

- 100 requests/minute per user
- 5 failed logins → account lockout (5 minutes)

---

## 🛠️ Troubleshooting

### Check Logs

```bash
# Docker
docker-compose logs api

# Local
python enterprise.py 2>&1
```

### Common Issues

**Port in use**
```bash
lsof -i :8000
kill <PID>
```

**Token expired**
```bash
# Login again to get new token
curl -X POST /api/v1/auth/login ...
```

**Database connection**
```bash
# Check PostgreSQL
docker-compose ps postgres
docker-compose logs postgres
```

---

## 📡 API Reference

Full API docs at: http://localhost:8000/docs

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/logout | Logout |
| GET | /api/v1/agents | List agents |
| GET | /api/v1/agents/{id} | Agent status |
| POST | /api/v1/tasks | Create task |
| GET | /api/v1/tasks | List tasks |
| PUT | /api/v1/tasks/{id} | Update task |
| DELETE | /api/v1/tasks/{id} | Delete task |
| POST | /api/v1/messages | Send message |
| GET | /api/v1/messages | Get messages |
| GET | /api/v1/workflow | Get phase |
| PUT | /api/v1/workflow/advance | Next phase |
| GET | /api/v1/users | List users |
| POST | /api/v1/users | Create user |
| GET | /api/v1/tenants | List tenants |
| POST | /api/v1/tenants | Create tenant |
| GET | /api/v1/audit | Audit logs |
| GET | /health | Health check |