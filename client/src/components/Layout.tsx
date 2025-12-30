import { Link, useLocation } from "wouter";
import { Home, Wind, BookOpen, BarChart2, GraduationCap, ArrowLeft, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  backgroundOverlay?: React.ReactNode;
  showBack?: boolean;
  backPath?: string;
}

export default function Layout({ children, backgroundOverlay, showBack, backPath }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const showNav = location !== "/launch/training" && !showBack;

  return (
    <div className="min-h-screen w-full bg-[#0c0c1d] text-white flex flex-col max-w-md mx-auto shadow-none overflow-hidden relative font-sans">
      {/* Flat Background - No Images */}
      <div className="absolute inset-0 z-0 w-full h-full bg-[#0c0c1d] pointer-events-none" />

      {/* Custom Background Overlay */}
      {backgroundOverlay && (
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          {backgroundOverlay}
        </div>
      )}

      {/* Back Header */}
      {showBack && (
        <header className="relative z-10 p-4 flex items-center">
          <button 
            onClick={() => setLocation(backPath || "/launch")}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white/70" />
          </button>
        </header>
      )}
      
      <main className={cn(
        "flex-1 flex flex-col overflow-y-auto scrollbar-hide relative z-10 w-full h-full",
        showNav ? "pb-24" : "pb-0"
      )}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/launch", icon: Home, label: "Home" },
    { path: "/launch/library", icon: BookOpen, label: "Library" },
    { path: "/launch/progress", icon: BarChart2, label: "Progress" },
    { path: "/launch/learn", icon: GraduationCap, label: "Learn" },
    { path: "/launch/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0c0c1d]/80 backdrop-blur-xl z-50 max-w-md mx-auto py-4 flex justify-around items-center border-t border-white/5">
      {navItems.map((item) => {
        const isActive = location === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <div className="cursor-pointer group p-2">
              <item.icon
                size={26}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={cn(
                    "transition-all duration-300",
                    isActive ? "text-[#ac41c3]" : "text-white/70"
                )}
              />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
