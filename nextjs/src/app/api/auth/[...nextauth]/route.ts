import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

// =============================================================================
// CONFIGURATION
// =============================================================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_UPDATE_AGE = 60 * 60 * 1000; // 1 hour

// In-memory rate limiting (use Redis in prod)
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

// =============================================================================
// USER DATABASE (replace with real DB)
// =============================================================================

interface User {
  id: string;
  tenant_id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  image?: string;
}

const users: User[] = [
  {
    id: 'usr_admin_001',
    tenant_id: 'org_001',
    email: 'admin@acme.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqKXJXJ8jS', // password123
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'usr_operator_001',
    tenant_id: 'org_001',
    email: 'operator@acme.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqKXJXJ8jS',
    name: 'Operator',
    role: 'operator',
  },
];

// =============================================================================
// HELPERS
// =============================================================================

function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

function checkAccountLockout(email: string): { locked: boolean; message?: string } {
  const attempt = loginAttempts.get(email.toLowerCase());
  
  if (!attempt) return { locked: false };
  
  if (attempt.lockedUntil > Date.now()) {
    const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 1000 / 60);
    return { 
      locked: true, 
      message: `Account locked. Try again in ${remaining} minutes.` 
    };
  }
  
  return { locked: false };
}

function recordFailedAttempt(email: string): void {
  const emailLower = email.toLowerCase();
  const attempt = loginAttempts.get(emailLower) || { attempts: 0, lockedUntil: 0 };
  
  attempt.attempts += 1;
  
  if (attempt.attempts >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }
  
  loginAttempts.set(emailLower, attempt);
}

function clearFailedAttempts(email: string): void {
  loginAttempts.delete(email.toLowerCase());
}

// =============================================================================
// AUTH OPTIONS
// =============================================================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenant: { label: 'Tenant', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const { locked, message } = checkAccountLockout(credentials.email);
        if (locked) {
          throw new Error(message || 'Account locked');
        }

        // Rate limit check
        const { success } = await rateLimit(credentials.email, 5, 60);
        if (!success) {
          throw new Error('Too many attempts. Try again later.');
        }

        const user = findUserByEmail(credentials.email);
        
        if (!user) {
          recordFailedAttempt(credentials.email);
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          recordFailedAttempt(credentials.email);
          throw new Error('Invalid credentials');
        }

        // Login successful
        clearFailedAttempts(credentials.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenant_id: user.tenant_id,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID || '',
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.tenant_id = (user as any).tenant_id;
        token.role = (user as any).role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).tenant_id = token.tenant_id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow only configured providers
      if (account?.provider && !['google', 'azure-ad', 'credentials'].includes(account.provider)) {
        return false;
      }
      return true;
    },
  },
  
  session: {
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
    strategy: 'jwt',
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding',
  },
  
  events: {
    async signIn({ message, user, account, profile }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`User signed out`);
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
    },
    async updateUser({ user, profile }) {
      console.log(`User updated: ${user.email}`);
    },
    async linkAccount({ user, account, profile }) {
      console.log(`Account linked: ${user.email} -> ${account.provider}`);
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  adapter: undefined, // Add PrismaAdapter for persistent sessions
};

// =============================================================================
// API ROUTE HANDLER
// =============================================================================

const handler = NextAuth(authOptions);

export default handler;