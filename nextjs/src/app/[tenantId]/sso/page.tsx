'use client';

import { useState } from 'react';
import { 
  Settings, 
  Key,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Shield
} from 'lucide-react';

const providers = [
  { 
    id: '1', 
    name: 'Google Workspace', 
    type: 'google',
    status: 'active',
    domain: 'acme.com',
    users: 12,
  },
  { 
    id: '2', 
    name: 'Microsoft Entra ID', 
    type: 'azure',
    status: 'inactive',
    domain: 'company.com',
    users: 0,
  },
  { 
    id: '3', 
    name: 'Okta', 
    type: 'okta',
    status: 'inactive',
    domain: '',
    users: 0,
  },
  { 
    id: '4', 
    name: 'Auth0', 
    type: 'auth0',
    status: 'inactive',
    domain: '',
    users: 0,
  },
];

const samlConfigs = [
  { id: '1', acsUrl: 'https://agentforge.io/saml/acs', entityId: 'agentforge.io', cert: 'MIIC...' },
];

export default function SSOPage() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showSecrets, setShowSecrets] = useState({});

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SSO Configuration</h1>
          <p className="text-muted-foreground">Single sign-on and identity providers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          Add Provider
        </button>
      </div>

      {/* OAuth Providers */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">OAuth / OIDC Providers</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <div 
              key={provider.id}
              className={`p-4 rounded-lg border hover:border-primary cursor-pointer ${
                selectedProvider === provider.id ? 'border-primary bg-primary/10' : ''
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.status === 'active' ? `${provider.domain} · ${provider.users} users` : 'Not configured'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  provider.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {provider.status}
                </span>
              </div>
              
              {selectedProvider === provider.id && provider.status === 'inactive' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Client ID"
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                  <input
                    type={showSecrets[provider.id] ? 'text' : 'password'}
                    placeholder="Client Secret"
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                  <input
                    type="text"
                    placeholder="Authorized redirect URIs"
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                  <button className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground">
                    Connect
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SAML */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">SAML Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Entity ID</label>
            <input
              type="text"
              value="agentforge.io"
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              readOnly
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Assertion Consumer Service (ACS) URL</label>
            <input
              type="text"
              value="https://agentforge.io/saml/acs"
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background font-mono text-sm"
              readOnly
            />
          </div>

          <div>
            <label className="text-sm font-medium">X.509 Certificate</label>
            <textarea
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background font-mono text-xs h-24 resize-none"
              defaultValue="-----BEGIN CERTIFICATE-----
MIICXTCCAUUCAQAwGDEWMBQGI1pm
...
-----END CERTIFICATE-----"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-muted">
          <p className="text-sm text-muted-foreground">Download metadata XML for IdP configuration</p>
        </div>
      </div>

      {/* SCIM */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">SCIM UserProvisioning</h3>
          <button className="flex items-center gap-2 px-3 py-1 border rounded-md text-sm">
            <Plus className="h-4 w-4" />
            Enable
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Sync users automatically with your identity provider
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">SCIM Endpoint</label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">API Key</label>
            <input
              type="password"
              placeholder="Bearer token..."
              className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
            />
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Password Policy</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Require minimum 8 characters</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Require uppercase and lowercase</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Require at least one number</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm">Require special character</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Require MFA</span>
          </label>
        </div>
      </div>

      {/* Session Settings */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Session Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Session Duration</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
              <option>Indefinite</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Max Concurrent Sessions</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
              <option>1 session</option>
              <option>3 sessions</option>
              <option>5 sessions</option>
              <option>Unlimited</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Idle Timeout</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>8 hours</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Force Re-auth After</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}