'use client';

import { useState } from 'react';
import { 
  Bell,
  Plus,
  Settings,
  Mail,
  MessageSquare,
  Smartphone,
  Webhook,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Send
} from 'lucide-react';

const notificationChannels = [
  { id: '1', name: 'Email', icon: Mail, status: 'active' },
  { id: '2', name: 'Slack', icon: MessageSquare, status: 'active' },
  { id: '3', name: 'SMS', icon: Smartphone, status: 'inactive' },
  { id: '4', name: 'Webhook', icon: Webhook, status: 'active' },
];

const notifications = [
  { id: '1', type: 'task', title: 'Task completed', channel: 'Email', status: 'sent', sentAt: '2 min ago' },
  { id: '2', type: 'task', title: 'Task assigned to you', channel: 'Slack', status: 'sent', sentAt: '5 min ago' },
  { id: '3', type: 'alert', title: 'Agent error rate > 5%', channel: 'Webhook', status: 'sent', sentAt: '1 hour ago' },
  { id: '4', type: 'mention', title: 'You were mentioned', channel: 'Email', status: 'sent', sentAt: '3 hours ago' },
  { id: '5', type: 'reminder', title: 'Sprint planning', channel: 'Email', status: 'pending', sentAt: 'Tomorrow' },
];

const rules = [
  { id: '1', event: 'task.completed', channel: 'all', enabled: true },
  { id: '2', event: 'task.assigned', channel: 'email,slack', enabled: true },
  { id: '3', event: 'agent.error', channel: 'webhook', enabled: true },
  { id: '4', event: 'mention', channel: 'email', enabled: true },
  { id: '5', event: 'sprint.start', channel: 'email', enabled: false },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState('rules');
  const [enabledRules, setEnabledRules] = useState<Record<string, boolean>>({
    '1': true, '2': true, '3': true, '4': true, '5': false,
  });

  const toggleRule = (id: string) => {
    setEnabledRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Alert rules and channels</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          New Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('rules')}
          className={`px-4 py-2 border-b-2 ${tab === 'rules' ? 'border-primary' : 'border-transparent'}`}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          Rules
        </button>
        <button
          onClick={() => setTab('channels')}
          className={`px-4 py-2 border-b-2 ${tab === 'channels' ? 'border-primary' : 'border-transparent'}`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Channels
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 border-b-2 ${tab === 'history' ? 'border-primary' : 'border-transparent'}`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          History
        </button>
      </div>

      {/* Rules */}
      {tab === 'rules' && (
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">Event</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Enabled</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b">
                  <td className="p-4">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {rule.event}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {rule.channel.split(',').map(ch => (
                        <span key={ch} className="text-xs px-2 py-1 bg-primary/10 rounded">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        enabledRules[rule.id] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        enabledRules[rule.id] ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-accent rounded"><Edit className="h-4 w-4" /></button>
                      <button className="p-1 hover:bg-accent rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Channels */}
      {tab === 'channels' && (
        <div className="grid gap-4 md:grid-cols-2">
          {notificationChannels.map((channel) => (
            <div key={channel.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {channel.status === 'active' ? 'Connected' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  channel.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {channel.status}
                </span>
              </div>
              {channel.status === 'inactive' && (
                <button className="w-full mt-3 px-3 py-2 border rounded-md">
                  Configure
                </button>
              )}
              {channel.status === 'active' && (
                <button className="w-full mt-3 px-3 py-2 border rounded-md">
                  Test Connection
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">Notification</th>
                <th className="p-4">Type</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id} className="border-b">
                  <td className="p-4">
                    <p className="font-medium">{notif.title}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                      {notif.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{notif.channel}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notif.status === 'sent' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notif.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{notif.sentAt}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slack Integration */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Slack Integration</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Webhook URL</label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Default Channel</label>
            <input
              type="text"
              placeholder="#alerts"
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Save Slack
        </button>
      </div>
    </div>
  );
}