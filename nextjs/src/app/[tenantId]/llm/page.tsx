'use client';

import { useState } from 'react';
import { 
  Settings, 
  Key,
  Plus,
  Trash2,
  TestTube,
  ChevronDown,
  Zap,
  Brain,
  Server,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const llms = [
  { 
    id: '1', 
    name: 'GPT-4', 
    provider: 'OpenAI',
    model: 'gpt-4-turbo',
    status: 'active',
    cost: '$0.03/1k tokens',
    context: '128k',
    latency: '15s',
  },
  { 
    id: '2', 
    name: 'GPT-3.5', 
    provider: 'OpenAI',
    model: 'gpt-3.5-turbo',
    status: 'active',
    cost: '$0.002/1k tokens',
    context: '16k',
    latency: '3s',
  },
  { 
    id: '3', 
    name: 'Claude-3 Opus', 
    provider: 'Anthropic',
    model: 'claude-3-opus',
    status: 'inactive',
    cost: '$0.015/1k tokens',
    context: '200k',
    latency: '20s',
  },
  { 
    id: '4', 
    name: 'Claude-3 Sonnet', 
    provider: 'Anthropic',
    model: 'claude-3-sonnet',
    status: 'active',
    cost: '$0.003/1k tokens',
    context: '200k',
    latency: '8s',
  },
  { 
    id: '5', 
    name: 'Mistral', 
    provider: 'Mistral AI',
    model: 'mistral-medium',
    status: 'inactive',
    cost: '$0.001/1k tokens',
    context: '32k',
    latency: '5s',
  },
  { 
    id: '6', 
    name: 'Llama 2', 
    provider: 'Meta',
    model: 'llama-2-70b',
    status: 'inactive',
    cost: 'Self-hosted',
    context: '4k',
    latency: 'N/A',
  },
];

const providers = ['all', 'OpenAI', 'Anthropic', 'Mistral AI', 'Meta'];

export default function LLMConfigPage() {
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const filtered = llms.filter(l => 
    selectedProvider === 'all' || l.provider === selectedProvider
  );

  const activeLLMs = llms.filter(l => l.status === 'active');
  const totalCost = activeLLMs.reduce((sum, l) => sum + parseFloat(l.cost.replace('$', '').replace('/1k tokens', '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LLM Configuration</h1>
          <p className="text-muted-foreground">Manage language models</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" />
          Add Model
        </button>
      </div>

      {/* API Keys */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">API Keys</h3>
        <div className="space-y-4">
          {['OpenAI', 'Anthropic', 'Mistral'].map(provider => (
            <div key={provider} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{provider}</p>
                <p className="text-sm text-muted-foreground">API key for {provider} models</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  className="w-64 px-3 py-2 rounded-md border bg-background"
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 hover:bg-accent rounded-md"
                >
                  {showKey ? <XCircle className="h-4 w-4" /> : <Key className="h-4 w-4" />}
                </button>
                <button className="p-2 hover:bg-accent rounded-md">
                  <TestTube className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Models</p>
          <p className="text-2xl font-bold">{llms.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeLLMs.length}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Providers</p>
          <p className="text-2xl font-bold">{providers.length - 1}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Avg Cost/1k</p>
          <p className="text-2xl font-bold">${totalCost.toFixed(3)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {providers.map(provider => (
          <button
            key={provider}
            onClick={() => setSelectedProvider(provider)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedProvider === provider 
                ? 'bg-primary text-primary-foreground'
                : 'border hover:bg-accent'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>

      {/* LLM Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((llm) => (
          <div 
            key={llm.id}
            className="p-4 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{llm.name}</h3>
                  <p className="text-sm text-muted-foreground">{llm.provider}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                llm.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {llm.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Model</p>
                <p className="font-mono text-xs">{llm.model}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Context</p>
                <p>{llm.context}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost</p>
                <p>{llm.cost}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Latency</p>
                <p>{llm.latency}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded">
                <TestTube className="h-3 w-3" />
                Test
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded">
                <Settings className="h-3 w-3" />
                Config
              </button>
              <button className="p-1 hover:bg-accent rounded text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback Chain */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Fallback Chain</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure retry sequence when primary model fails</p>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-md bg-muted">GPT-4</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="px-3 py-2 rounded-md bg-muted">Claude-3 Sonnet</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="px-3 py-2 rounded-md bg-muted">GPT-3.5</div>
        </div>
      </div>
    </div>
  );
}