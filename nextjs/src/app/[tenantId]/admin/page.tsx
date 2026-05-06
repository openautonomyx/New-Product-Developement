'use client';

import { useState } from 'react';
import { 
  Settings, 
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserPlus,
  Mail,
  Trash2,
  Edit,
  Key,
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

const accounts = [
  { 
    id: '1', 
    name: 'Acme Corp', 
    domain: 'acme.com',
    plan: 'enterprise',
    status: 'active',
    users: 12,
    agents: 7,
    createdAt: '2024-01-15',
  },
  { 
    id: '2', 
    name: 'My Startup', 
    domain: 'startup.io',
    plan: 'starter',
    status: 'active',
    users: 3,
    agents: 4,
    createdAt: '2024-02-20',
  },
  { 
    id: '3', 
    name: 'Dev Agency', 
    domain: 'devagency.com',
    plan: 'pro',
    status: 'active',
    users: 8,
    agents: 7,
    createdAt: '2024-03-01',
  },
  { 
    id: '4', 
    name: 'Inactive Corp', 
    domain: 'inactive.com',
    plan: 'starter',
    status: 'suspended',
    users: 2,
    agents: 3,
    createdAt: '2024-01-20',
  },
];

const users = [
  { id: '1', name: 'John Doe', email: 'john@acme.com', role: 'admin', tenant: 'acme.com', status: 'active', lastLogin: '2024-03-10' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@acme.com', role: 'operator', tenant: 'acme.com', status: 'active', lastLogin: '2024-03-09' },
  { id: '3', name: 'Mike Wilson', email: 'mike@startup.io', role: 'admin', tenant: 'startup.io', status: 'active', lastLogin: '2024-03-08' },
  { id: '4', name: 'Emily Brown', email: 'emily@devagency.com', role: 'operator', tenant: 'devagency.com', status: 'pending', lastLogin: '-' },
  { id: '5', name: 'David Lee', email: 'david@inactive.com', role: 'viewer', tenant: 'inactive.com', status: 'suspended', lastLogin: '2024-01-25' },
];

const roleLabels = {
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800' },
  operator: { label: 'Operator', color: 'bg-blue-100 text-blue-800' },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-800' },
};

const planColors = {
  starter: 'bg-gray-100 text-gray-800',
  pro: 'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800',
};

const statusColors = {
  active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
  suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
};

export default function AdminPage() {
  const [tab, setTab] = useState('accounts');
  const [search, setSearch] = useState('');

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.domain.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground">Manage accounts and users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          {tab === 'accounts' ? 'New Account' : 'New User'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('accounts')}
          className={`px-4 py-2 border-b-2 ${tab === 'accounts' ? 'border-primary' : 'border-transparent'}`}
        >
          <Building2 className="h-4 w-4 inline mr-2" />
          Accounts
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 border-b-2 ${tab === 'users' ? 'border-primary' : 'border-transparent'}`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Users
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={`Search ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">{tab === 'accounts' ? 'Total Accounts' : 'Total Users'}</p>
          <p className="text-2xl font-bold">{tab === 'accounts' ? accounts.length : users.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {(tab === 'accounts' ? accounts : users).filter(t => t.status === 'active').length}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold text-red-600">
            {(tab === 'accounts' ? accounts : users).filter(t => t.status === 'suspended').length}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {users.filter(u => u.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Content */}
      {tab === 'accounts' ? (
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">Account</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Users</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-accent/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.domain}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${planColors[account.plan as keyof typeof planColors]}`}>
                      {account.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span>{account.users}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      statusColors[account.status as keyof typeof statusColors]?.bg
                    } ${
                      statusColors[account.status as keyof typeof statusColors]?.text
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{account.createdAt}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-accent rounded"><Edit className="h-4 w-4" /></button>
                      <button className="p-1 hover:bg-accent rounded"><Key className="h-4 w-4" /></button>
                      <button className="p-1 hover:bg-accent rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">User</th>
                <th className="p-4">Tenant</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-accent/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{user.tenant}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${roleLabels[user.role as keyof typeof roleLabels]?.color}`}>
                      {roleLabels[user.role as keyof typeof roleLabels]?.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      statusColors[user.status as keyof typeof statusColors]?.bg
                    } ${
                      statusColors[user.status as keyof typeof statusColors]?.text
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{user.lastLogin}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-accent rounded"><Mail className="h-4 w-4" /></button>
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
    </div>
  );
}