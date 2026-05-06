# AgentForge FAQ

Frequently Asked Questions about building enterprise multi-agent AI systems.

---

## General

### What is AgentForge?

AgentForge is a production-ready multi-agent system for building AI products at enterprise scale. It includes 7 specialized agents (Research, PM, Engineering, QA, GTM, Sales, Customer Success), SOC2 security, multi-tenancy, and Docker deployment.

### What does it cost?

Open source (MIT license). You host it. Costs: infrastructure only (~$$50-100/month for small deployment).

### Who is it for?

- SaaS companies building AI products
- Enterprises needing SOC2 compliance
- Agencies building client AI solutions

---

## Security

### Is it SOC2 compliant?

Yes. Built with:
- JWT authentication
- Role-based access (admin/operator/viewer)
- Rate limiting (100/min)
- Account lockout (5 failed logins)
- Input validation (SQL/XSS protection)
- Audit logging (all actions)

### How does authentication work?

JWT tokens with:
- `user_id`
- `tenant_id`
- `role`
- Expiration

### Can I use my own auth?

Yes. Replace the auth module or add external providers (Auth0, Okta, Keycloak) via nginx.

---

## Multi-Tenancy

### How many tenants can I run?

Unlimited. Each tenant has:
- Unique `tenant_id`
- Isolated users, tasks, messages
- Custom domain support

### Is data completely isolated?

Yes. Every query includes `WHERE tenant_id = ?`. No cross-tenant access.

### Can tenants share data?

Yes. Add shared resource tables with `tenant_id = NULL`.

---

## Agents

### What do the agents do?

| Agent | Role |
|-------|------|
| Research | Market analysis, competitive intel |
| PM | Requirements, roadmap |
| Engineering | Code development |
| QA | Testing |
| GTM | Marketing, launch |
| Sales | Revenue |
| CS | Support |

### Can I add custom agents?

Yes. Extend `BaseAgent`:

```python
class CustomAgent(BaseAgent):
    name = "custom"
    description = "My custom agent"
    
    async def process(self, task):
        # Your logic
        return {"result": ""}
```

### Do agents use AI?

Currently rule-based. Integrate LLMs (OpenAI, Anthropic, local) via the agent `process()` method.

---

## Deployment

### What infrastructure do I need?

Minimum:
- 2 CPU, 4GB RAM
- PostgreSQL
- Redis
- (Kafka optional)

Recommended:
- 4+ CPU, 8GB+ RAM
- PostgreSQL + Redis + Kafka + Weaviate
- Nginx reverse proxy

### Can I use cloud?

Yes. Works on any host with Docker:
- AWS EC2
- GCP Cloud Run
- Azure Container Instances
- DigitalOcean Droplets

### Where are the configs?

- `Dockerfile` - API image
- `docker-compose.yml` - Full stack
- `nginx.conf` - Reverse proxy

---

## API

### How do I authenticate?

```bash
# Login
curl -X POST /api/v1/auth/login \
  -d '{"username":"admin","password":"pass"}'

# Use token
curl -H "Authorization: Bearer <token>" /api/v1/agents
```

### What's the base URL?

`http://localhost:8000/api/v1`

### Is there API documentation?

Yes. FastAPI auto-docs at `/docs`.

---

## Troubleshooting

### API won't start

```bash
# Check port
lsof -i :8000

# Check logs
docker-compose logs api
```

### Login fails

1. Check credentials (default: admin/admin123)
2. Verify account not locked (wait 5 min after 5 failed attempts)
3. Check rate limit

### Database errors

```bash
# Check PostgreSQL
docker-compose ps postgres
docker-compose logs postgres
```

### Slow performance

1. Check Redis connection
2. Increase worker count
3. Add caching

---

## Licensing

### What's the license?

MIT. Use freely, commercially too.

### Do I need to attribute?

Not required, but appreciated.

---

## Support

### How do I get help?

1. [GitHub Issues](https://github.com/openautonomyx/New-Product-Developement/issues)
2. [Documentation](/HOWTO)
3. [API Docs](/docs)

### Can I hire support?

Contact Autonomyx for enterprise support packages.

---

## Comparison

### vs LangChain Agents?

AgentForge = Full product (auth, multi-tenancy, workflow, UI)
LangChain = Library (you build the rest)

### vs AutoGen?

AutoGen = Multi-agent conversation
AgentForge = Full system with persistence, security, deployment

### vs Custom build?

AgentForge = Production-ready in hours vs months

---

## Future

### What's coming?

- LLM integration (OpenAI, Anthropic)
- Vector DB memory
- Real-time collaboration
-更多 agents
- Mobile app

### Can I request features?

Yes. Open a GitHub issue.

---

*More questions? Open an [issue](https://github.com/openautonomyx/New-Product-Developement/issues).*