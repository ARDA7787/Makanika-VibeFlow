import React from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  Users, 
  Wrench,
  Menu,
  Mic,
  Sparkles
} from "lucide-react";

type Section = "overview" | "sessions" | "escalations" | "leads" | "providers";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export function AdminLayout({ children, activeSection, setActiveSection }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "sessions", label: "Chat Sessions 🎙️", icon: MessageSquare },
    { id: "voice", label: "Voice Assistant", icon: Mic },
    { id: "elevenlabs", label: "ElevenLabs Agent", icon: Sparkles },
    { id: "escalations", label: "Escalations", icon: AlertTriangle },
    { id: "leads", label: "Leads", icon: FileText },
    { id: "providers", label: "Providers", icon: Users },
    { id: "customer", label: "Customer Portal", icon: Users }, // Added for menu item logic, though handled via onClick
  ] as const;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Wrench className="h-6 w-6 text-indigo-500 mr-3" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">RepairMatch</h1>
            <p className="text-xs text-slate-500 font-medium">Admin Console</p>
          </div>
        </div>

        <ScrollArea className="flex-1 py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              // @ts-ignore - type overlap issue is fine here
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "voice") {
                      navigate("/voice");
                      return;
                    }
                    if (item.id === "elevenlabs") {
                      navigate("/elevenlabs-agent");
                      return;
                    }
                    if (item.id === "customer") {
                      navigate("/customer");
                      return;
                    }
                    setActiveSection(item.id as Section);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                      : "hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {item.label}
                  {item.id === "escalations" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {item.id === "voice" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  )}
                  {item.id === "elevenlabs" && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  )}
                  {item.id === "customer" && (
                     <div className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                       Public
                     </div>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/30">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@repairmatch.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Mobile only) */}
        <header className="h-16 lg:hidden flex items-center px-4 bg-white border-b border-slate-200">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="-ml-2 mr-2"
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </Button>
          <span className="font-semibold text-slate-900">RepairMatch Admin</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
