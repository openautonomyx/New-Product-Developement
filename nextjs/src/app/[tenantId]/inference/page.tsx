'use client';

import { useState } from 'react';
import { 
  Settings, 
  Play,
  Save,
  RefreshCw,
  ChevronDown,
  Zap,
  Brain,
  MessageSquare,
  Code,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const inferencePresets = [
  { 
    id: '1', 
    name: 'Fast Response', 
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    maxTokens: 1000,
    topP: 0.9,
    description: 'Quick, focused responses',
  },
  { 
    id: '2', 
    name: 'Balanced', 
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 4000,
    topP: 0.95,
    description: 'Standard balanced output',
  },
  { 
    id: '3', 
    name: 'Creative', 
    model: 'gpt-4-turbo',
    temperature: 1.0,
    maxTokens: 4000,
    topP: 0.95,
    description: 'Creative and varied responses',
  },
  { 
    id: '4', 
    name: 'Precise', 
    model: 'claude-3-sonnet',
    temperature: 0.1,
    maxTokens: 2000,
    topP: 0.8,
    description: 'Accurate, factual output',
  },
  { 
    id: '5', 
    name: 'Code Expert', 
    model: 'gpt-4-turbo',
    temperature: 0.2,
    maxTokens: 8000,
    topP: 0.9,
    description: 'Detailed code generation',
  },
];

const systemPrompts = [
  { id: '1', name: 'Research Agent', content: 'You are a research agent analyzing market data...' },
  { id: '2', name: 'PM Agent', content: 'You are a product manager creating specifications...' },
  { id: '3', name: 'Engineering Agent', content: 'You are a software engineer writing code...' },
  { id: '4', name: 'QA Agent', content: 'You are a QA engineer testing software...' },
];

export default function InferencePage() {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [testPrompt, setTestPrompt] = useState('Explain quantum computing in simple terms');
  const [testResult, setTestResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(0.95);

  const runTest = async () => {
    setIsRunning(true);
    setTestResult('');
    await new Promise(r => setTimeout(r, 2000));
    setTestResult('Quantum computing is a type of computation whose operations can exploit phenomena of quantum mechanics...');
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inference Configuration</h1>
          <p className="text-muted-foreground">Configure LLM inference parameters</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Presets */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Inference Presets</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {inferencePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                setTemperature(preset.temperature);
                setMaxTokens(preset.maxTokens);
                setTopP(preset.topP);
              }}
              className={`p-3 rounded-lg border text-left hover:border-primary transition-colors ${
                selectedPreset === preset.id ? 'border-primary bg-primary/10' : ''
              }`}
            >
              <p className="font-medium">{preset.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{preset.model}</p>
              <p className="text-xs text-muted-foreground mt-1">temp: {preset.temperature}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold mb-4">Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Temperature: {temperature}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Precise (0)</span>
                <span>Balanced (1)</span>
                <span>Creative (2)</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Tokens: {maxTokens}</label>
              <input
                type="range"
                min="100"
                max="8000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100</span>
                <span>8000</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Top P: {topP}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused (0)</span>
                <span>Diverse (1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold mb-4">System Prompt</h3>
          <select className="w-full px-3 py-2 rounded-md border bg-background">
            <option>Select a system prompt...</option>
            {systemPrompts.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <textarea
            placeholder="Or enter custom system prompt..."
            className="w-full mt-3 px-3 py-2 rounded-md border bg-background h-32 resize-none"
          ></textarea>
        </div>
      </div>

      {/* Test Inference */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Test Inference</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a test prompt..."
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border bg-background"
          />
          <button 
            onClick={runTest}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-3 rounded-md bg-muted">
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        {/* Result Stats */}
        {testResult && (
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Tokens: {testResult.length * 1.3}</span>
            <span>Latency: 1.2s</span>
            <span>Model: gpt-4-turbo</span>
          </div>
        )}
      </div>

      {/* Advanced */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Advanced Options</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Enable streaming</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Cache responses</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Log prompts</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Safety filter</span>
          </label>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Cost Estimate</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm text-muted-foreground">Input</p>
            <p className="text-xl font-bold">$0.001</p>
            <p className="text-xs text-muted-foreground">/ 1k tokens</p>
          </div>
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm text-muted-foreground">Output</p>
            <p className="text-xl font-bold">$0.003</p>
            <p className="text-xs text-muted-foreground">/ 1k tokens</p>
          </div>
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm text-muted-foreground">Est. per 100 calls</p>
            <p className="text-xl font-bold">$0.45</p>
            <p className="text-xs text-muted-foreground">/ day</p>
          </div>
        </div>
      </div>
    </div>
  );
}