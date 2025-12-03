import { Link, useLocation } from "wouter";
import { Home, Wind, BookOpen, BarChart2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// New dark background image import
import darkBg from '@assets/generated_images/dark_abstract_gradient_waves_background.png';

interface LayoutProps {
  children: React.ReactNode;
  backgroundOverlay?: React.ReactNode;
}

export default function Layout({ children, backgroundOverlay }: LayoutProps) {
  const [location] = useLocation();
  const showNav = location !== "/training";

  return (
    <div className="min-h-screen w-full bg-background flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border relative font-sans transform-gpu">
      {/* Global Background Image - Fixed Option 3 */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
         <div className="absolute inset-0 bg-background/80 z-10" /> {/* Tint */}
         <img src={darkBg} alt="" className="w-full h-full object-cover relative z-0" />
      </div>

      {/* Custom Background Overlay */}
      {backgroundOverlay && (
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          {backgroundOverlay}
        </div>
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
    { path: "/", icon: Home, label: "Home" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/progress", icon: BarChart2, label: "Progress" },
    { path: "/learn", icon: GraduationCap, label: "Learn" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#17171C]/90 backdrop-blur-xl z-50 max-w-md mx-auto pb-4 pt-2 border-t border-white/5">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full cursor-pointer group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-all duration-300 mb-1",
                  isActive ? "bg-primary/20" : "bg-transparent"
                )}>
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-300"
                    fill={isActive ? "currentColor" : "none"}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
