import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { Play, FileText, Zap, Moon, Activity, Bell, Clock, Package, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSessions, updateUser } from "@/lib/api";

export default function Home() {
  const { user } = useCurrentUser();
  const [, setLocation] = useLocation();
  const [greeting, setGreeting] = useState("Hello");
  const queryClient = useQueryClient();

  const updateRemindersMutation = useMutation({
    mutationFn: (enabled: boolean) => updateUser(user!.id, { remindersEnabled: enabled }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: () => getUserSessions(user!.id, 10),
    enabled: !!user,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <p className="text-white/70">Loading...</p>
        </div>
      </Layout>
    );
  }

  // Calculate progress based on completed sessions
  const completedSessions = sessions.filter(s => s.completed).length;
  const progressPercent = Math.min((completedSessions / 10) * 100, 100);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header with Avatar */}
        <header className="flex justify-between items-center pt-4">
          <div className="space-y-1">
            <p className="text-white text-xl font-bold" data-testid="text-greeting">{greeting},</p>
            <h1 className="text-3xl font-bold text-white tracking-tight" data-testid="text-username">{user.name}</h1>
          </div>
          <div className="flex gap-4 items-center">
             <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/10 w-12 h-12" data-testid="button-notifications">
                <Bell className="w-6 h-6" strokeWidth={1.5} />
             </Button>
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#ac41c3] shadow-md shadow-black/40">
              <img src={AVATAR_IMAGE} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Hero Card - Flat Gradient */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-6 text-white shadow-md shadow-black/40 relative overflow-hidden cursor-pointer"
          onClick={() => setLocation("/training")}
          data-testid="card-daily-goal"
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
                    <circle 
                      cx="32" cy="32" r="28" 
                      stroke="white" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray="175" 
                      strokeDashoffset={175 - (175 * progressPercent / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" data-testid="text-progress-percent">
                    {Math.round(progressPercent)}%
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
                      <p className="text-sm font-bold" data-testid="text-streak">{user.streak} Days</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-full">
                      <Activity size={14} />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/80 uppercase tracking-wide">Sessions</p>
                      <p className="text-sm font-bold" data-testid="text-sessions">{completedSessions}</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Reminder Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#3b1645] rounded-2xl p-4 flex items-center justify-between shadow-md shadow-black/40"
          data-testid="card-reminder-status"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center">
              <Clock size={18} className="text-[#ac41c3]" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Daily Reminders</p>
              {user.remindersEnabled ? (
                <p className="text-white/60 text-xs">{user.morningTime} & {user.eveningTime}</p>
              ) : (
                <p className="text-white/60 text-xs">Tap to enable</p>
              )}
            </div>
          </div>
          <Switch
            checked={user.remindersEnabled}
            onCheckedChange={(checked) => updateRemindersMutation.mutate(checked)}
            disabled={updateRemindersMutation.isPending}
            className="data-[state=checked]:bg-[#ac41c3]"
            data-testid="switch-reminders"
          />
        </motion.div>

        {/* Shop Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.a
            href="https://olfly.com/starter-kit"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-4 flex items-center gap-3 cursor-pointer shadow-md shadow-black/40 hover:opacity-90 transition-opacity"
            data-testid="button-starter-kit"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Get Starter Kit</p>
              <p className="text-white/70 text-xs">Essential oils set</p>
            </div>
          </motion.a>
          
          <motion.a
            href="https://olfly.com/shop"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#3b1645] rounded-2xl p-4 flex items-center gap-3 cursor-pointer shadow-md shadow-black/40 hover:bg-[#4a1c57] transition-colors"
            data-testid="button-shop"
          >
            <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="text-[#ac41c3]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Shop</p>
              <p className="text-white/70 text-xs">Browse products</p>
            </div>
          </motion.a>
        </div>

        {/* Top Routines Section - Flat Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-white">Top Routines</h2>
             <span className="text-sm text-[#db2faa] font-medium cursor-pointer hover:text-[#ac41c3]">See All</span>
          </div>
          
          <div className="space-y-4">
            {/* Routine Card 1 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-[#3b1645] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#4a1c57] transition-colors"
              data-testid="card-routine-morning"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center text-white shadow-sm shrink-0">
                <Play size={20} className="ml-0.5" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Morning Reset</h3>
                <p className="text-sm text-white/70">Lemon & Eucalyptus • 5 Min</p>
              </div>
            </motion.div>

            {/* Routine Card 2 */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-[#3b1645] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#4a1c57] transition-colors"
              data-testid="card-routine-evening"
            >
              <div className="h-12 w-12 rounded-full bg-[#3b1645] flex items-center justify-center text-[#db2faa] shrink-0 border border-white/5">
                <Moon size={20} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Evening Calm</h3>
                <p className="text-sm text-white/70">Lavender & Rose • 10 Min</p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
