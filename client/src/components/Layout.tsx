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
      {/* Flat Background */}
      <div className="absolute inset-0 z-0 w-full h-full bg-[#0c0c1d] pointer-events-none" />

      {/* Persistent starfield — all screens */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Top zone */}
          <circle cx="6%"  cy="4%"  r="1.2" fill="white" opacity="0.45"/>
          <circle cx="15%" cy="9%"  r="0.8" fill="white" opacity="0.28"/>
          <circle cx="24%" cy="3%"  r="1.5" fill="white" opacity="0.38"/>
          <circle cx="37%" cy="7%"  r="0.9" fill="white" opacity="0.22"/>
          <circle cx="50%" cy="2%"  r="1.1" fill="white" opacity="0.42"/>
          <circle cx="61%" cy="8%"  r="1.4" fill="white" opacity="0.32"/>
          <circle cx="73%" cy="4%"  r="0.7" fill="white" opacity="0.25"/>
          <circle cx="82%" cy="10%" r="1.3" fill="white" opacity="0.4"/>
          <circle cx="91%" cy="5%"  r="1.0" fill="white" opacity="0.35"/>
          {/* Mid zone */}
          <circle cx="9%"  cy="30%" r="0.8" fill="white" opacity="0.18"/>
          <circle cx="20%" cy="42%" r="1.1" fill="white" opacity="0.2"/>
          <circle cx="33%" cy="25%" r="0.7" fill="white" opacity="0.16"/>
          <circle cx="47%" cy="38%" r="1.0" fill="white" opacity="0.18"/>
          <circle cx="59%" cy="22%" r="0.9" fill="white" opacity="0.2"/>
          <circle cx="70%" cy="45%" r="1.2" fill="white" opacity="0.16"/>
          <circle cx="83%" cy="28%" r="0.8" fill="white" opacity="0.18"/>
          <circle cx="94%" cy="36%" r="1.1" fill="white" opacity="0.15"/>
          {/* Lower zone */}
          <circle cx="5%"  cy="65%" r="0.9" fill="white" opacity="0.14"/>
          <circle cx="18%" cy="78%" r="1.0" fill="white" opacity="0.12"/>
          <circle cx="31%" cy="60%" r="0.7" fill="white" opacity="0.13"/>
          <circle cx="44%" cy="72%" r="1.2" fill="white" opacity="0.11"/>
          <circle cx="57%" cy="82%" r="0.8" fill="white" opacity="0.12"/>
          <circle cx="68%" cy="67%" r="1.1" fill="white" opacity="0.13"/>
          <circle cx="79%" cy="88%" r="0.9" fill="white" opacity="0.1"/>
          <circle cx="90%" cy="73%" r="1.3" fill="white" opacity="0.12"/>
          {/* Soft glow clusters */}
          <circle cx="25%" cy="12%" r="4"   fill="white" opacity="0.05"/>
          <circle cx="72%" cy="16%" r="5"   fill="white" opacity="0.04"/>
          <circle cx="88%" cy="55%" r="3.5" fill="white" opacity="0.04"/>
          <circle cx="12%" cy="55%" r="3"   fill="white" opacity="0.04"/>
        </svg>
      </div>

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
