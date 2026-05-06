'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground">Enter your email to get reset instructions</p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 rounded-md bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Check your email for reset link</span>
            </div>
            <Link href="/login" className="flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </button>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}