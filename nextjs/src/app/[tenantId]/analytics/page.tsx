'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Brain,
  Users,
  Target,
  Activity,
  FileText,
  AlertTriangle
} from 'lucide-react';

const agentScores = [
  { agent: 'Research', accuracy: 94, speed: 12, reliability: 98, tasks: 45 },
  { agent: 'PM', accuracy: 89, speed: 8, reliability: 95, tasks: 32 },
  { agent: 'Engineering', accuracy: 91, speed: 45, reliability: 92, tasks: 67 },
  { agent: 'QA', accuracy: 96, speed: 30, reliability: 99, tasks: 54 },
  { agent: 'GTM', accuracy: 87, speed: 15, reliability: 88, tasks: 28 },
  { agent: 'Sales', accuracy: 82, speed: 25, reliability: 85, tasks: 19 },
  { agent: 'Customer Success', accuracy: 90, speed: 18, reliability: 91, tasks: 38 },
];

const evaluations = [
  { id: '1', task: 'Market analysis', agent: 'Research', accuracy: 95, feedback: 'Excellent market coverage', date: '2024-03-10' },
  { id: '2', task: 'PR review', agent: 'Engineering', accuracy: 88, feedback: 'Good security feedback', date: '2024-03-09' },
  { id: '3', task: 'User stories', agent: 'PM', accuracy: 92, feedback: 'Clear requirements', date: '2024-03-08' },
  { id: '4', task: 'Test generation', agent: 'QA', accuracy: 98, feedback: 'High coverage', date: '2024-03-07' },
  { id: '5', task: 'Email outreach', agent: 'Sales', accuracy: 75, feedback: 'Needs personalization', date: '2024-03-06' },
];

const benchmarks = [
  { metric: 'Accuracy', target: 90, current: 91, trend: 'up' },
  { metric: 'Speed (avg)', target: 20, current: 22, trend: 'down' },
  { metric: 'Reliability', target: 95, current: 93, trend: 'stable' },
  { metric: 'Task Success', target: 85, current: 87, trend: 'up' },
];

const historyData = [
  { week: 'W1', score: 82 },
  { week: 'W2', score: 85 },
  { week: 'W3', score: 84 },
  { week: 'W4', score: 88 },
  { week: 'W5', score: 89 },
  { week: 'W6', score: 91 },
];

export default function AnalyticsPage() {
  const [selectedAgent, setSelectedAgent] = useState('all');

  const avgAccuracy = agentScores.reduce((s, a) => s + a.accuracy, 0) / agentScores.length;
  const avgSpeed = agentScores.reduce((s, a) => s + a.speed, 0) / agentScores.length;
  const avgReliability = agentScores.reduce((s, a) => s + a.reliability, 0) / agentScores.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Evaluation</h1>
          <p className="text-muted-foreground">Agent performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-md border bg-background">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Avg Accuracy</p>
          <p className="text-2xl font-bold text-green-600">{avgAccuracy.toFixed(0)}%</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +3% from last week
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Avg Speed</p>
          <p className="text-2xl font-bold">{avgSpeed.toFixed(0)}s</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <TrendingDown className="h-3 w-3" /> -2s slower
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Reliability</p>
          <p className="text-2xl font-bold">{avgReliability.toFixed(0)}%</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +1%
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
          <p className="text-2xl font-bold">283</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +18%
          </p>
        </div>
      </div>

      {/* Benchmarks */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Performance vs Targets</h3>
        <div className="space-y-4">
          {benchmarks.map((b) => (
            <div key={b.metric} className="flex items-center gap-4">
              <div className="w-32">
                <p className="text-sm font-medium">{b.metric}</p>
                <p className="text-xs text-muted-foreground">Target: {b.target}</p>
              </div>
              <div className="flex-1 h-3 rounded-full bg-muted">
                <div 
                  className={`h-3 rounded-full ${
                    b.current >= b.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((b.current / b.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="w-24 text-right">
                <p className="font-medium">{b.current}</p>
                {b.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                {b.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Scores */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-2">Agent</th>
                <th className="pb-2">Accuracy</th>
                <th className="pb-2">Speed</th>
                <th className="pb-2">Reliability</th>
                <th className="pb-2">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {agentScores.map((a) => (
                <tr key={a.agent} className="border-t">
                  <td className="py-2 font-medium">{a.agent}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${a.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{a.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="text-sm">{a.speed}s</span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-blue-500" 
                          style={{ width: `${a.reliability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{a.reliability}%</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="text-sm">{a.tasks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Evaluations */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Recent Evaluations</h3>
        <div className="space-y-3">
          {evaluations.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-md border">
              <div>
                <p className="font-medium">{e.task}</p>
                <p className="text-sm text-muted-foreground">{e.agent} · {e.date}</p>
                <p className="text-sm mt-1">{e.feedback}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  e.accuracy >= 90 ? 'bg-green-100 text-green-800' :
                  e.accuracy >= 75 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {e.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="font-semibold mb-4">Performance Trend</h3>
        <div className="h-32 flex items-end gap-2">
          {historyData.map((d, i) => (
            <div key={d.week} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary rounded-t"
                style={{ height: `${d.score}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-2">{d.week}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}