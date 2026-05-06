"""
Lago Billing Integration
Usage-based billing with meters, plans, and subscriptions
"""

import os
from typing import Optional, Dict, Any
import httpx
from pydantic import BaseModel

# Lago Configuration
LAGO_API_KEY = os.getenv("LAGO_API_KEY", "")
LAGO_API_URL = os.getenv("LAGO_API_URL", "https://api.lago.com")


class Lago Customer(BaseModel):
    """Lago customer with external_id matching tenant"""
    external_id: str  # tenant_id
    address: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None


class LagoEvent(BaseModel):
    """Billable event"""
    event_code: str  # e.g., "api_calls", "agents_ran", "tasks_created"
    external_customer_id: str  # tenant_id
    properties: Optional[Dict[str, Any]] = None


class BillingService:
    """Lago billing integration"""
    
    def __init__(self):
        self.api_key = LAGO_API_KEY
        self.base_url = LAGO_API_URL
        self.client = httpx.Client(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
    
    def create_customer(self, tenant_id: str, email: str, name: str) -> Dict:
        """Create customer in Lago"""
        response = self.client.post("/api/v1/customers", json={
            "customer": {
                "external_id": tenant_id,
                "email": email,
                "name": name,
            }
        })
        return response.json()
    
    def create_subscription(self, tenant_id: str, plan_code: str) -> Dict:
        """Subscribe tenant to billing plan"""
        response = self.client.post("/api/v1/subscriptions", json={
            "subscription": {
                "external_customer_id": tenant_id,
                "plan_code": plan_code,
            }
        })
        return response.json()
    
    def track_event(self, tenant_id: str, event_code: str, properties: Dict = None) -> Dict:
        """Track billable event"""
        response = self.client.post("/api/v1/events", json={
            "event": {
                "transaction_id": f"{tenant_id}_{event_code}",
                "external_customer_id": tenant_id,
                "event_code": event_code,
                "properties": properties or {},
            }
        })
        return response.json()
    
    def get_invoice(self, tenant_id: str) -> Dict:
        """Get current invoice"""
        response = self.client.get(f"/api/v1/customers/{tenant_id}/invoices")
        return response.json()
    
    def get_usage(self, tenant_id: str) -> Dict:
        """Get current usage"""
        response = self.client.get(f"/api/v1/customers/{tenant_id}/current_usage")
        return response.json()


# Event tracking helpers
billing = BillingService()

async def track_api_call(tenant_id: str, endpoint: str, duration_ms: int):
    """Track API call for billing"""
    try:
        billing.track_event(
            tenant_id,
            "api_call",
            {"endpoint": endpoint, "duration_ms": duration_ms}
        )
    except Exception as e:
        print(f"Billing error: {e}")

async def track_agent_run(tenant_id: str, agent: str, duration_ms: int):
    """Track agent execution for billing"""
    try:
        billing.track_event(
            tenant_id,
            "agent_run",
            {"agent": agent, "duration_ms": duration_ms}
        )
    except Exception as e:
        print(f"Billing error: {e}")

async def track_task_created(tenant_id: str, phase: str):
    """Track task creation for billing"""
    try:
        billing.track_event(
            tenant_id,
            "task_created",
            {"phase": phase}
        )
    except Exception as e:
        print(f"Billing error: {e}")


# Pricing Plans
PLANS = {
    "starter": {
        "name": "Starter",
        "monthly_price": 0,
        "included": {
            "api_calls": 1000,
            "agents_ran": 100,
            "tasks_created": 50,
        },
        "overage": {
            "api_call": 0.001,
            "agent_run": 0.01,
            "task_created": 0.05,
        }
    },
    "pro": {
        "name": "Pro",
        "monthly_price": 299,
        "included": {
            "api_calls": 50000,
            "agents_ran": 5000,
            "tasks_created": 1000,
        },
        "overage": {
            "api_call": 0.0005,
            "agent_run": 0.005,
            "task_created": 0.02,
        }
    },
    "enterprise": {
        "name": "Enterprise",
        "monthly_price": 999,
        "included": {
            "api_calls": 500000,
            "agents_ran": 50000,
            "tasks_created": 10000,
        },
        "overage": {
            "api_call": 0.0002,
            "agent_run": 0.002,
            "task_created": 0.01,
        }
    }
}


def check_limits(tenant_id: str, event_type: str, count: int = 1) -> Dict:
    """Check if tenant is within limits"""
    usage = billing.get_usage(tenant_id)
    plan = usage.get("current_usage", {}).get("plan", {})
    limits = PLANS.get(plan.get("code", "starter"), PLANS["starter"])
    
    included = limits.get("included", {}).get(event_type, 0)
    used = usage.get("current_usage", {}).get("event_usages", {}).get(event_type, {}).get("count", 0)
    
    return {
        "within_limit": used + count <= included,
        "used": used,
        "limit": included,
        "remaining": max(0, included - used),
    }