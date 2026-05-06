'use client';

import { useSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  MessageSquare, 
  BarChart3,
  Settings,
  Plus,
  Activity
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/[tenantId]/dashboard' },
  { icon: Bot, label: 'Agents', href: '/[tenantId]/agents' },
  { icon: Users, label: 'Tasks', href: '/[tenantId]/tasks' },
  { icon: MessageSquare, label: 'Messages', href: '/[tenantId]/messages' },
  { icon: BarChart3, label: 'Analytics', href: '/[tenantId]/analytics' },
  { icon: Settings, label: 'Settings', href: '/[tenantId]/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-xl font-bold">AgentForge</h1>
          <p className="text-sm text-muted-foreground">Enterprise AI</p>
        </div>
        
        <nav className="px-3">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href.replace('[tenantId]', 'demo')}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}