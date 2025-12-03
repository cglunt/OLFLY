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
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header with Avatar */}
        <header className="flex justify-between items-center pt-4">
          <div className="space-y-1">
            <p className="text-white text-xl font-bold">{greeting},</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Sherman</h1>
          </div>
          <div className="flex gap-4 items-center">
             <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/10 w-12 h-12">
                <Bell className="w-6 h-6" strokeWidth={1.5} />
             </Button>
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#DF37FF] shadow-md shadow-black/40">
              <img src={AVATAR_IMAGE} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Hero Card - Flat Gradient */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-r from-[#DF37FF] to-[#A259FF] rounded-2xl p-6 text-white shadow-md shadow-black/40 relative overflow-hidden cursor-pointer"
          onClick={() => setLocation("/training")}
        >
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <span className="text-white/90 text-sm font-medium uppercase tracking-wider">Daily Goal</span>
                 <h2 className="text-2xl font-bold mt-1">Scent Training</h2>
                 <p className="text-white/90 text-sm mt-1">20 Min Session</p>
               </div>
               <div className="w-16 h-16 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="45" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    72%
                  </div>
               </div>
             </div>
             
             <div className="flex gap-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-full">
                      <Zap size={14} fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/80 uppercase tracking-wide">Streak</p>
                      <p className="text-sm font-bold">{data.settings.streak} Days</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-full">
                      <Activity size={14} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/80 uppercase tracking-wide">Progress</p>
                      <p className="text-sm font-bold">+3.5%</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Top Routines Section - Flat Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-white">Top Routines</h2>
             <span className="text-sm text-[#A259FF] font-medium cursor-pointer hover:text-[#DF37FF]">See All</span>
          </div>
          
          <div className="space-y-4">
            {/* Routine Card 1 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-[#2B215B] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#322766] transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#DF37FF] to-[#A259FF] flex items-center justify-center text-white shadow-sm shrink-0">
                <Play size={20} className="ml-0.5" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Morning Reset</h3>
                <p className="text-sm text-[#B9AEE2]">Lemon & Eucalyptus • 5 Min</p>
              </div>
            </motion.div>

            {/* Routine Card 2 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-[#2B215B] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#322766] transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-[#231A4A] flex items-center justify-center text-[#A259FF] shrink-0">
                <Moon size={20} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Evening Calm</h3>
                <p className="text-sm text-[#B9AEE2]">Lavender & Rose • 10 Min</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Resources Horizontal Scroll */}
        <div className="space-y-4 pb-6">
           <h2 className="text-xl font-bold text-white">Discover</h2>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
              <div 
                className="min-w-[220px] h-[140px] bg-[#2B215B] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#322766] transition-colors cursor-pointer shadow-md shadow-black/40"
                onClick={() => setLocation("/article/restoring-smell")}
              >
                <div className="p-2 bg-[#231A4A] w-fit rounded-xl">
                    <FileText size={20} className="text-[#DF37FF]" />
                </div>
                <div>
                    <p className="text-xs text-[#B9AEE2] mb-1 uppercase tracking-wide">Essential Read</p>
                    <h4 className="font-bold text-white text-base leading-tight">Restoring Your Smell</h4>
                </div>
              </div>

              <div className="min-w-[220px] h-[140px] bg-[#2B215B] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#322766] transition-colors cursor-pointer shadow-md shadow-black/40 opacity-70">
                <div className="p-2 bg-[#231A4A] w-fit rounded-xl">
                    <Zap size={20} className="text-yellow-500" />
                </div>
                <div>
                    <p className="text-xs text-[#B9AEE2] mb-1 uppercase tracking-wide">Quick Tip</p>
                    <h4 className="font-bold text-white text-base leading-tight">Safety First</h4>
                </div>
              </div>

              <div className="min-w-[220px] h-[140px] bg-[#2B215B] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#322766] transition-colors cursor-pointer shadow-md shadow-black/40 opacity-70">
                <div className="p-2 bg-[#231A4A] w-fit rounded-xl">
                    <Activity size={20} className="text-green-500" />
                </div>
                <div>
                    <p className="text-xs text-[#B9AEE2] mb-1 uppercase tracking-wide">Science</p>
                    <h4 className="font-bold text-white text-base leading-tight">How Neurons Heal</h4>
                </div>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
}
