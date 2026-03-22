import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { Play, Zap, Activity, Bell, Clock, Package, User, Flame } from "lucide-react";
import starterKitImg from "@assets/cynthiag11_product_photography_of_a_non-label_essential_oils_s_1767071916008.png";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserSessions } from "@/lib/api";
import { ReminderPermissionDialog } from "@/components/ReminderPermissionDialog";
import { useReminders } from "@/hooks/useReminders";
import { getNextReminderDisplay } from "@/lib/notifications";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function Home() {
  const { user: firebaseUser } = useAuth();
  const { user, refetch } = useCurrentUser(firebaseUser?.displayName || undefined);
  const [, setLocation] = useLocation();
  const [greeting, setGreeting] = useState(getGreeting);

  const queryKey = ["currentUser", firebaseUser?.displayName || undefined];

  const {
    permissionStatus,
    showPermissionDialog,
    setShowPermissionDialog,
    updateRemindersMutation,
    handleToggleReminders,
    handleAllowPermission,
    handleNotNow,
    isEnabled,
  } = useReminders({ user, queryKey });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: () => getUserSessions(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Refresh user data (streak, plan) each time Home is visited
  useEffect(() => {
    refetch();
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

  const completedSessions = sessions.filter(s => s.completed).length;
  const progressPercent = Math.min((completedSessions / 10) * 100, 100);
  const firstName = firebaseUser?.displayName?.split(' ')[0] || user.name;

  return (
    <Layout>
      {/* ── HERO — full-bleed top block ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#2e1060] via-[#6d45d2] to-[#d42fa0] shadow-2xl shadow-[#6d45d2]/40 pb-14 px-6 pt-4"
      >
        {/* Stars inside hero */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="8%"  cy="12%" r="1.3" fill="white" opacity="0.5"/>
          <circle cx="18%" cy="6%"  r="0.9" fill="white" opacity="0.35"/>
          <circle cx="30%" cy="18%" r="1.1" fill="white" opacity="0.4"/>
          <circle cx="45%" cy="8%"  r="0.7" fill="white" opacity="0.3"/>
          <circle cx="58%" cy="14%" r="1.4" fill="white" opacity="0.45"/>
          <circle cx="70%" cy="5%"  r="1.0" fill="white" opacity="0.38"/>
          <circle cx="82%" cy="20%" r="0.8" fill="white" opacity="0.3"/>
          <circle cx="92%" cy="9%"  r="1.2" fill="white" opacity="0.42"/>
          <circle cx="25%" cy="40%" r="0.7" fill="white" opacity="0.18"/>
          <circle cx="75%" cy="35%" r="0.9" fill="white" opacity="0.18"/>
          <circle cx="50%" cy="50%" r="0.8" fill="white" opacity="0.12"/>
          {/* Soft glow */}
          <circle cx="15%" cy="10%" r="5"   fill="white" opacity="0.05"/>
          <circle cx="80%" cy="15%" r="6"   fill="white" opacity="0.04"/>
        </svg>
        {/* Glow orbs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#db2faa]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-[#4a2080]/50 blur-2xl pointer-events-none" />

        {/* Header row */}
        <header className="relative z-10 flex justify-between items-center pt-2 mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium" data-testid="text-greeting">{greeting},</p>
            <h1 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap" data-testid="text-username">
              {firstName}
            </h1>
          </div>
          <div className="flex gap-3 items-center">
            <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/10 w-10 h-10" aria-label="Open notifications" data-testid="button-notifications">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            <div
              className="h-11 w-11 rounded-full overflow-hidden border-2 border-white/40 shadow-md cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Go to settings"
              onKeyDown={(e) => e.key === 'Enter' && setLocation('/launch/settings')}
              onClick={() => setLocation("/launch/settings")}
            >
              {firebaseUser?.photoURL ? (
                <img src={firebaseUser.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-white/20 flex items-center justify-center">
                  <User size={22} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Daily Goal content — integrated into hero */}
        <div
          className="relative z-10 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Start today's scent training session"
          onKeyDown={(e) => e.key === 'Enter' && setLocation('/launch/training')}
          onClick={() => setLocation("/launch/training")}
          data-testid="card-daily-goal"
        >
          <div className="flex justify-between items-start mb-5">
            <div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Daily Goal</span>
              <h2 className="text-2xl font-bold text-white mt-0.5">Scent Training</h2>
              <p className="text-white/70 text-sm mt-0.5">~2 Min Session</p>
            </div>
            {/* Progress ring */}
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
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white" data-testid="text-progress-percent">
                {Math.round(progressPercent)}%
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 pb-5 border-b border-white/20 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Zap size={13} fill="currentColor" className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/70 uppercase tracking-wide">Streak</p>
                <p className="text-sm font-bold text-white" data-testid="text-streak">{user.streak} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Activity size={13} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/70 uppercase tracking-wide">Sessions</p>
                <p className="text-sm font-bold text-white" data-testid="text-sessions">{completedSessions}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="bg-white text-[#6d45d2] hover:bg-white/90 font-bold py-3 px-10 rounded-2xl shadow-lg text-base"
              aria-label="Start training session"
              data-testid="button-start-training"
            >
              <Play size={18} className="mr-2" fill="currentColor" />
              Start Training
            </Button>
          </div>
        </div>
        {/* Fade bottom of hero into panel colour — hides any corner crevice artefact */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-[#0c0c1d] pointer-events-none" />
      </motion.div>

      {/* ── CONTENT — framed below hero ── */}
      <div className="px-6 pt-6 pb-4 space-y-4 bg-[#0c0c1d] rounded-t-[2.5rem] -mt-6 relative z-10 shadow-[0_-20px_60px_rgba(0,0,0,0.7)]">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#3b1645] rounded-2xl p-4 flex items-center justify-between shadow-md shadow-black/40"
          data-testid="card-reminder-status"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center">
              <Bell size={18} className="text-[#ac41c3]" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Daily Reminders</p>
              {isEnabled ? (
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <Clock size={10} />
                  Next at {getNextReminderDisplay(user.morningTime || '08:00', user.eveningTime || '20:00')}
                </p>
              ) : permissionStatus === 'denied' ? (
                <p className="text-red-400 text-xs">Permission denied</p>
              ) : (
                <p className="text-white/60 text-xs">Tap to enable</p>
              )}
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleReminders}
            disabled={updateRemindersMutation.isPending}
            aria-label="Toggle daily reminders"
            className="data-[state=checked]:bg-[#ac41c3]"
            data-testid="switch-reminders"
          />
        </motion.div>

        <ReminderPermissionDialog
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
          onAllow={handleAllowPermission}
          onNotNow={handleNotNow}
        />

        <motion.a
          href="https://amzn.to/4jqeXZo"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-[1.5rem] p-3 flex items-center gap-3 cursor-pointer shadow-md shadow-black/40 hover:opacity-90 transition-opacity"
          data-testid="button-starter-kit"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base">Get Starter Kit</p>
            <p className="text-white/70 text-sm">Essential oils set</p>
          </div>
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <img src={starterKitImg} alt="Starter Kit" className="w-full h-full object-cover" />
          </div>
        </motion.a>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Top Routines</h2>

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation("/launch/training?routine=morning")}
            role="button"
            aria-label="Start Morning Reset routine"
            className="bg-[#3b1645] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#4a1c57] transition-colors"
            data-testid="card-routine-morning"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center text-white shadow-sm shrink-0">
              <Play size={20} className="ml-0.5" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Morning Reset</h3>
              <p className="text-sm text-white/70">Lemon & Eucalyptus • 1 Min</p>
            </div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation("/launch/training?routine=baseline")}
            role="button"
            aria-label="Start Baseline routine"
            className="bg-[#3b1645] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md shadow-black/40 hover:bg-[#4a1c57] transition-colors"
            data-testid="card-routine-baseline"
          >
            <div className="h-12 w-12 rounded-full bg-[#3b1645] flex items-center justify-center text-[#db2faa] shrink-0 border border-white/5">
              <Flame size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Baseline</h3>
              <p className="text-sm text-white/70">Rose, Lemon, Eucalyptus & Clove • 2 Min</p>
            </div>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
}
