'use client';

import { useState } from 'react';
import { 
  Settings, 
  Mail,
  Save,
  Plus,
  Send,
  Inbox,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const emailAccounts = [
  { 
    id: '1', 
    name: 'Notifications', 
    email: 'notifications@acme.com',
    provider: 'AWS SES',
    status: 'active',
    sent: 1250,
    received: 0,
  },
  { 
    id: '2', 
    name: 'Support', 
    email: 'support@acme.com',
    provider: 'AWS SES',
    status: 'active',
    sent: 340,
    received: 890,
  },
];

const emailTemplates = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to {{workspace}}!', opens: 890 },
  { id: '2', name: 'Password Reset', subject: 'Reset your password', opens: 450 },
  { id: '3', name: 'Task Assigned', subject: 'New task: {{task_name}}', opens: 320 },
  { id: '4', name: 'Agent Complete', subject: '{{agent}} finished', opens: 280 },
];

const bounceSettings = {
  hardBounces: true,
  softBounces: true,
  complaints: true,
  rejections: true,
};

export default function EmailPage() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [tab, setTab] = useState('accounts');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Configuration</h1>
          <p className="text-muted-foreground">Email accounts and templates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('accounts')}
          className={`px-4 py-2 border-b-2 ${tab === 'accounts' ? 'border-primary' : 'border-transparent'}`}
        >
          <Mail className="h-4 w-4 inline mr-2" />
          Accounts
        </button>
        <button
          onClick={() => setTab('templates')}
          className={`px-4 py-2 border-b-2 ${tab === 'templates' ? 'border-primary' : 'border-transparent'}`}
        >
          <Inbox className="h-4 w-4 inline mr-2" />
          Templates
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`px-4 py-2 border-b-2 ${tab === 'settings' ? 'border-primary' : 'border-transparent'}`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Accounts */}
      {tab === 'accounts' && (
        <div className="space-y-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
            <Plus className="h-4 w-4" />
            Add Account
          </button>

          <div className="grid gap-4 md:grid-cols-2">
            {emailAccounts.map((account) => (
              <div key={account.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Provider</p>
                    <p className="font-medium">{account.provider}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sent</p>
                    <p className="font-medium">{account.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Received</p>
                    <p className="font-medium">{account.received.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm border rounded">
                    <Send className="h-3 w-3" />
                    Test
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm border rounded">
                    <Settings className="h-3 w-3" />
                    Config
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      {tab === 'templates' && (
        <div className="space-y-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
            <Plus className="h-4 w-4" />
            New Template
          </button>

          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4">Template</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Opens</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailTemplates.map((template) => (
                  <tr key={template.id} className="border-b">
                    <td className="p-4 font-medium">{template.name}</td>
                    <td className="p-4 text-sm">{template.subject}</td>
                    <td className="p-4">{template.opens}</td>
                    <td className="p-4">
                      <button className="px-2 py-1 text-sm border rounded">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div className="space-y-6">
          {/* SMTP */}
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">SMTP Configuration</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">SMTP Host</label>
                <input
                  type="text"
                  placeholder="email-smtp.us-east-1.amazonaws.com"
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">SMTP Port</label>
                <input
                  type="text"
                  placeholder="587"
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="AKIA..."
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Save SMTP
            </button>
          </div>

          {/* Bounce Handling */}
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">Bounce & Complaint Handling</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  defaultChecked={bounceSettings.hardBounces} 
                />
                <span className="text-sm">Auto-handle hard bounces</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  defaultChecked={bounceSettings.softBounces} 
                />
                <span className="text-sm">Auto-handle soft bounces (retry 3x)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  defaultChecked={bounceSettings.complaints} 
                />
                <span className="text-sm">Handle Amazon SES complaints</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  defaultChecked={bounceSettings.rejections} 
                />
                <span className="text-sm">Handle rejections</span>
              </label>
            </div>
          </div>

          {/* DKIM */}
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-4">DKIM / SPF</h3>
            <div className="p-3 rounded-md bg-muted">
              <p className="text-sm font-medium">SPF Record</p>
              <p className="text-sm font-mono mt-1">v=spf1 include:amazonses.com ~all</p>
            </div>
            <div className="p-3 rounded-md bg-muted mt-2">
              <p className="text-sm font-medium">DKIM Selector</p>
              <p className="text-sm font-mono mt-1">agentforge._domainkey</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}