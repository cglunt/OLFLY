import { Link, useLocation } from "wouter";
import { Home, Wind, BookOpen, BarChart2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border/50">
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/training", icon: Wind, label: "Train" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/progress", icon: BarChart2, label: "Progress" },
    { path: "/learn", icon: GraduationCap, label: "Learn" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border/50 z-50 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 cursor-pointer",
                  isActive
                    ? "text-primary bg-primary/10 scale-105"
                    : "text-muted-foreground hover:text-primary/70 hover:bg-muted/50"
                )}
              >
                <item.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn("transition-transform duration-300", isActive && "scale-110")}
                />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
