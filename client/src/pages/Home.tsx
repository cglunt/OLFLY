import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredData, AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { Play, Video, FileText, Zap, Moon, Activity, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [data] = useState(getStoredData());
  const [, setLocation] = useLocation();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Hello");
    else if (hour < 18) setGreeting("Hi");
    else setGreeting("Good Evening");
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header with Avatar */}
        <header className="flex justify-between items-center pt-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-lg font-medium">{greeting},</p>
            <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Sherman</h1>
          </div>
          <div className="flex gap-4 items-center">
             <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/10">
                <Bell className="w-6 h-6" />
             </Button>
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/20">
              <img src={AVATAR_IMAGE} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Hero Card - "Daily Goals" style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-primary rounded-[2rem] p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden cursor-pointer"
          onClick={() => setLocation("/training")}
        >
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <span className="text-white/80 text-sm font-medium">Daily Goal</span>
                 <h2 className="text-2xl font-bold mt-1">Scent Training</h2>
                 <p className="text-white/90 text-sm">20 Min</p>
               </div>
               <div className="w-16 h-16 relative">
                  {/* Simple circular progress */}
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="45" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    72%
                  </div>
               </div>
             </div>
             
             <div className="flex gap-4 pt-2 border-t border-white/20">
                <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 rounded-full">
                      <Zap size={14} fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/70">Streak</p>
                      <p className="text-sm font-bold">{data.settings.streak} Days</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-white/20 rounded-full">
                      <Activity size={14} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/70">Progress</p>
                      <p className="text-sm font-bold">+3.5%</p>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        {/* Top Routines Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="font-heading text-xl font-bold text-white">Top Routines</h2>
             <span className="text-sm text-primary font-medium cursor-pointer hover:text-primary/80">See All</span>
          </div>
          
          <div className="space-y-3">
            {/* Routine Card 1 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-secondary rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-primary/30">
                <Play size={20} fill="currentColor" className="ml-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Morning Reset</h3>
                <p className="text-xs text-muted-foreground">Lemon & Eucalyptus • 5 Min</p>
              </div>
            </motion.div>

            {/* Routine Card 2 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-secondary rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
                <Moon size={20} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">Evening Calm</h3>
                <p className="text-xs text-muted-foreground">Lavender & Rose • 10 Min</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Resources Horizontal Scroll */}
        <div className="space-y-4">
           <h2 className="font-heading text-xl font-bold text-white">Discover</h2>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
              {[1,2,3].map((_, i) => (
                 <div key={i} className="min-w-[200px] h-[120px] bg-secondary rounded-[1.5rem] p-4 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer border border-white/5">
                    <div className="p-2 bg-white/5 w-fit rounded-xl">
                       <FileText size={18} className="text-accent" />
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground mb-1">Article</p>
                       <h4 className="font-bold text-white text-sm">The Science of Smell</h4>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </Layout>
  );
}
