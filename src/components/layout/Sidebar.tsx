
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Receipt, Users, PieChart, Settings, LogOut, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center py-3 px-4 rounded-lg text-sidebar-foreground gap-3 transition-all duration-200 animate-slide-in',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-1'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null; // Mobile view handled by main layout
  }

  return (
    <div className="w-64 h-screen bg-sidebar-background flex flex-col border-r border-sidebar-border">
      <div className="flex items-center py-6 px-4 animate-fade-in">
        <div className="h-10 w-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center mr-3">
          <div className="h-6 w-6 text-sidebar-primary">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">ExpenseSync</h1>
          <p className="text-xs text-sidebar-foreground/70">Track & manage easily</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-1 px-3 py-6 flex-1">
        <SidebarItem 
          icon={Home} 
          label="Dashboard" 
          href="/dashboard" 
          active={location.pathname === '/dashboard'} 
        />
        <SidebarItem 
          icon={Receipt} 
          label="Expenses" 
          href="/expenses" 
          active={location.pathname === '/expenses'} 
        />
        <SidebarItem 
          icon={Users} 
          label="Groups" 
          href="/groups" 
          active={location.pathname === '/groups' || location.pathname.startsWith('/groups/')} 
        />
        <SidebarItem 
          icon={PieChart} 
          label="Analytics" 
          href="/analytics" 
          active={location.pathname === '/analytics'} 
        />
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          href="/settings" 
          active={location.pathname === '/settings'} 
        />
        <Link
          to="/"
          className="flex items-center py-3 px-4 rounded-lg text-sidebar-foreground gap-3 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
