import { Link, useLocation } from "wouter";
import { Home, Wind, BookOpen, BarChart2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  // Hide bottom nav on Training screen for immersive feel
  const showNav = location !== "/training";

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border/50 relative font-sans">
      <main className="flex-1 flex flex-col overflow-y-auto pb-24 scrollbar-hide relative bg-[#F9F4ED]">
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/progress", icon: BarChart2, label: "Progress" },
    { path: "/learn", icon: GraduationCap, label: "Learn" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 max-w-md mx-auto pb-2 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full cursor-pointer group",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300 mb-1",
                  isActive ? "bg-transparent" : "group-hover:bg-secondary/30"
                )}>
                  <item.icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-300"
                    fill={isActive ? "currentColor" : "none"}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
