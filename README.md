# AgentForge - Enterprise Multi-Agent Product Development System

[![SOC2 Compliant](https://img.shields.io/badge/SOC2-Compliant-green)](https://)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://)
[![Production](https://img.shields.io/badge/Production-Ready-green)](https://)

Production-grade multi-agent system for building AI products at enterprise scale with 7 specialized agents, SOC2 compliance, and Docker deployment.

## 🚀 Quick Start

```bash
# Clone & Run
git clone https://github.com/openautonomyx/New-Product-Developement.git
cd New-Product-Developement
docker-compose up -d

# Access
# API:  http://localhost:8000
# UI:   http://localhost:8000/ui
# Docs: http://localhost:8000/docs
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentForge Platform                     │
├─────────────────────────────────────────────────────────────┤
│  React Dashboard (UI)                                      │
│  ├── Agent Monitor    │ Task Manager   │ Message Viewer    │
│  └── Debug Console                                            │
├─────────────────────────────────────────────────────────────┤
│  FastAPI REST API (Port 8000)                             │
│  ├── JWT Auth       │ Multi-Tenant   │ Rate Limiting     │
│  ├── RBAC (Admin/Operator/Viewer) │ Workflow Engine      │
│  └── Audit Logging                                      │
├─────────────────────────────────────────────────────────────┤
│  7 Specialized Agents                                      │
│  ├── Research      │ PM           │ Engineering          │
│  ├── QA           │ GTM          │ Sales               │
│  └── Customer Success                                    │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                         │
│  ├── PostgreSQL  │ Redis  │ Kafka  │ Weaviate (Vector) │
│  └── Docker/K8s Deployment                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security (SOC2)

- **Authentication**: JWT with role-based access
- **Authorization**: RBAC (admin, operator, viewer)
- **Rate Limiting**: 100 requests/minute per user
- **Account Lockout**: 5 failed login attempts
- **Input Validation**: SQL/XSS protection
- **Audit Logging**: All actions logged with tenant_id
- **Security Headers**: HSTS, CSP, X-Frame-Options

## 🏢 Multi-Tenancy

```python
# Every request verified with tenant_id
@require_tenant
def get_resources(token: TokenData):
    # tenant_id from JWT used for isolation
    resources = db.query(tenant_id=token.tenant_id)
    return resources
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/v1/auth/login | Login + get JWT |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/agents | List agents |
| POST | /api/v1/tasks | Create task |
| GET | /api/v1/tasks | List tasks |
| POST | /api/v1/messages | Send message |
| GET | /api/v1/messages | Get messages |
| GET | /api/v1/workflow | Get workflow |
| PUT | /api/v1/workflow/advance | Advance phase |
| GET | /api/v1/audit | Audit logs |

### API Examples

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Create Task
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"New Feature","description":"Add API","phase":"research"}'
```

## 👥 7 Agents

| Agent | Role | Phase |
|-------|------|-------|
| 🔍 Research | Market research, competitive analysis | Ideate/Research |
| 📋 PM | Requirements, roadmap, prioritization | Spec |
| ⚙️ Engineering | Code development, architecture | Build |
| 🧪 QA | Testing, quality assurance | Test |
| 📢 GTM | Marketing, launch strategy | Launch |
| 💰 Sales | Revenue, customer acquisition | Launch |
| ❤️Customer Success | Support, retention | Iterate |

## 🔄 Workflow

```
Ideate → Research → Spec → Build → Test → Launch → Iterate
   ↓       ↓        ↓      ↓      ↓       ↓         ↓
[Idea] → [Valid] → [PRD] → [Code] → [QA] → [Live] → [Feedback]
```

## 🐳 Docker Deployment

```bash
# Production
docker-compose up -d

# Or custom
docker build -t agentforge .
docker run -p 8000:8000 agentforge
```

### Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@postgres:5432/db
REDIS_URL=redis://:pass@redis:6379
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
JWT_SECRET_KEY=your-secret
SECRET_KEY=your-secret
```

## 📊 Dashboard

- **Agent Monitor**: Real-time agent status
- **Task Manager**: Create/track tasks
- **Message Viewer**: Inter-agent messages
- **Debug Console**: API/SQL debugging

## 🔧 Configuration

### User Roles

| Role | Permissions |
|------|-------------|
| admin | Full access, manage tenants |
| operator | Manage users, tasks |
| viewer | Read-only access |

### Workflow Phases

1. `ideate` - Idea generation
2. `research` - Market/competitor analysis
3. `spec` - Requirements & spec
4. `build` - Development
5. `test` - QA & testing
6. `launch` - Go-to-market
7. `iterate` - Feedback & improvement

## 📝 License

MIT License - [Autonomyx](https://autonomyx.ai)
