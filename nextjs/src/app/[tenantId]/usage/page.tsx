'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  Bot,
  MessageSquare,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const usage = [
  { month: 'Mar 2024', calls: 45200, cost: 89.50, limit: 50000 },
  { month: 'Feb 2024', calls: 38400, cost: 76.80, limit: 50000 },
  { month: 'Jan 2024', calls: 42100, cost: 84.20, limit: 50000 },
  { month: 'Dec 2023', calls: 31500, cost: 63.00, limit: 50000 },
  { month: 'Nov 2023', calls: 28900, cost: 57.80, limit: 25000 },
  { month: 'Oct 2023', calls: 22400, cost: 44.80, limit: 25000 },
];

const currentUsage = [
  { type: 'API Calls', used: 45200, limit: 50000, cost: 45.20 },
  { type: 'Agent Runs', used: 3840, limit: 5000, cost: 38.40 },
  { type: 'Tasks', used: 890, limit: 1000, cost: 44.50 },
  { type: 'Messages', used: 12340, limit: 15000, cost: 0 },
];

const plans = [
  { name: 'Starter', price: 0, calls: 1000, agents: 100 },
  { name: 'Pro', price: 299, calls: 50000, agents: 5000 },
  { name: 'Enterprise', price: 999, calls: 500000, agents: 50000 },
];

export default function UsagePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const currentMonth = usage[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usage & Billing</h1>
          <p className="text-muted-foreground">Monitor usage and manage subscription</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Current Plan */}
      <div className="p-6 rounded-lg border bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <h2 className="text-3xl font-bold">Pro</h2>
            <p className="text-2xl font-bold mt-2">$299<span className="text-sm font-normal">/month</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Active
            </div>
            <p className="text-sm text-muted-foreground mt-1">Renews Apr 10, 2024</p>
          </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentUsage.map((item) => (
          <div key={item.type} className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">{item.type}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold">{item.used.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">/ {item.limit.toLocaleString()}</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div 
                className="h-2 rounded-full bg-primary" 
                style={{ width: `${(item.used / item.limit) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2">${item.cost}</p>
          </div>
        ))}
      </div>

      {/* Usage Chart */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Usage History</h3>
        <div className="h-48 flex items-end gap-2">
          {usage.map((u, i) => (
            <div key={u.month} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary rounded-t"
                style={{ height: `${(u.calls / 50000) * 100}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-2">{u.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Available Plans</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`p-4 rounded-lg border ${
                selectedPlan === plan.name.toLowerCase() 
                  ? 'border-primary bg-primary/10' 
                  : 'bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{plan.name}</h4>
                {selectedPlan === plan.name.toLowerCase() && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-2xl font-bold mt-2">
                ${plan.price}<span className="text-sm font-normal">/mo</span>
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  {plan.calls.toLocaleString()} API calls
                </p>
                <p className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  {plan.agents.toLocaleString()} agent runs
                </p>
              </div>
              <button 
                onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                disabled={selectedPlan === plan.name.toLowerCase()}
                className="w-full mt-4 px-3 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                {selectedPlan === plan.name.toLowerCase() ? 'Current' : 'Switch'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-3 rounded-md border">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:underline">Update</button>
        </div>
      </div>

      {/* Invoices */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Recent Invoices</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-2">Date</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            {usage.slice(0, 3).map((u, i) => (
              <tr key={u.month} className="border-t">
                <td className="py-2">{u.month}</td>
                <td className="py-2">${u.cost}</td>
                <td className="py-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
                </td>
                <td className="py-2 text-right">
                  <button className="text-sm text-primary hover:underline">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}