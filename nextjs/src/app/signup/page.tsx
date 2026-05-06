'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate signup
    setTimeout(() => {
      router.push('/login?registered=true');
    }, 1000);
  };

  const passwordChecks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Get started with AgentForge</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Workspace</label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="acme"
                required
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2 rounded-md border bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password strength */}
            {password && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className={`flex items-center gap-1 text-xs ${check.valid ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${check.valid ? 'fill-green-600' : ''}`} />
                    {check.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email || !password || !workspace}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create account
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="underline">Privacy Policy</a>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}