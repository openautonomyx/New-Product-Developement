'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal,
  Mail,
  Shield,
  Trash2,
  Crown,
  User,
  Settings
} from 'lucide-react';

const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john@acme.com', role: 'admin', avatar: 'JD', status: 'active' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@acme.com', role: 'operator', avatar: 'SS', status: 'active' },
  { id: '3', name: 'Mike Wilson', email: 'mike@acme.com', role: 'operator', avatar: 'MW', status: 'active' },
  { id: '4', name: 'Emily Brown', email: 'emily@acme.com', role: 'viewer', avatar: 'EB', status: 'active' },
  { id: '5', name: 'David Lee', email: 'david@acme.com', role: 'viewer', avatar: 'DL', status: 'pending' },
];

const roleLabels = {
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800', icon: Crown },
  operator: { label: 'Operator', color: 'bg-blue-100 text-blue-800', icon: Settings },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-800', icon: User },
};

export default function TeamPage() {
  const [search, setSearch] = useState('');
  
  const filtered = teamMembers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground">Manage team members and roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
        />
      </div>

      {/* Members List */}
      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Member</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => {
              const role = roleLabels[member.role as keyof typeof roleLabels];
              const RoleIcon = role.icon;
              return (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${role.color}`}>
                      <RoleIcon className="h-3 w-3" />
                      {role.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-accent rounded-md">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-md">
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-md text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(roleLabels).map(([key, role]) => {
          const RoleIcon = role.icon;
          const count = teamMembers.filter(m => m.role === key).length;
          return (
            <div key={key} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5" />
                <span className="font-medium">{role.label}</span>
              </div>
              <p className="text-2xl font-bold mt-2">{count}</p>
              <p className="text-sm text-muted-foreground">members</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}