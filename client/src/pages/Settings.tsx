import { useState } from "react";
import Layout from "@/components/Layout";
import { ChevronRight, User, Bell, Shield, FileText, HelpCircle, LogOut, RotateCcw, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user: firebaseUser, logOut } = useAuth();
  const { user } = useCurrentUser(firebaseUser?.displayName || undefined);
  const queryClient = useQueryClient();
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [morningTime, setMorningTime] = useState("09:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  
  const queryKey = ["currentUser", firebaseUser?.displayName || undefined];

  const updateRemindersMutation = useMutation({
    mutationFn: (enabled: boolean) => updateUser(user!.id, { remindersEnabled: enabled }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKey, updatedUser);
    },
  });

  const updateTimesMutation = useMutation({
    mutationFn: (times: { morningTime: string; eveningTime: string }) => 
      updateUser(user!.id, times),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKey, updatedUser);
      setShowReminderDialog(false);
    },
  });

  const handleOpenReminderDialog = () => {
    if (user) {
      setMorningTime(user.morningTime || "09:00");
      setEveningTime(user.eveningTime || "20:00");
      setShowReminderDialog(true);
    }
  };

  const handleReplayOnboarding = async () => {
    if (user) {
      const updatedUser = await updateUser(user.id, { hasOnboarded: false });
      queryClient.setQueryData(queryKey, updatedUser);
      setLocation("/");
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("olfly_user_id");
      queryClient.clear();
      setLocation("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/70">Manage your preferences</p>
        </header>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Account</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              {firebaseUser?.photoURL ? (
                <img 
                  src={firebaseUser.photoURL} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-[#ac41c3]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                  <User size={20} className="text-[#ac41c3]" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-white font-medium text-lg">
                  {firebaseUser?.displayName || user.name}
                </p>
                <p className="text-white/50 text-sm">
                  {firebaseUser?.email || "Guest account"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Preferences</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <Bell size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Daily Reminders</p>
                <p className="text-white/50 text-sm">{user.morningTime} & {user.eveningTime}</p>
              </div>
              <Switch
                checked={user.remindersEnabled}
                onCheckedChange={(checked) => updateRemindersMutation.mutate(checked)}
                disabled={updateRemindersMutation.isPending}
                className="data-[state=checked]:bg-[#ac41c3]"
              />
            </div>
            <div 
              className="p-4 flex items-center gap-4 border-b border-white/5 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              onClick={handleOpenReminderDialog}
              data-testid="button-edit-reminders"
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <Clock size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Edit Reminder Times</p>
                <p className="text-white/50 text-sm">Change when you get reminded</p>
              </div>
              <ChevronRight size={20} className="text-white/40" />
            </div>
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              onClick={handleReplayOnboarding}
              data-testid="button-replay-onboarding"
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <RotateCcw size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">View Tutorial</p>
                <p className="text-white/50 text-sm">Replay the onboarding guide</p>
              </div>
              <ChevronRight size={20} className="text-white/40" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Legal</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div 
              className="p-4 flex items-center gap-4 border-b border-white/5 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              onClick={() => setLocation("/legal")}
              data-testid="link-legal-hub"
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <FileText size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Terms and Policies</p>
                <p className="text-white/50 text-sm">View legal documents</p>
              </div>
              <ChevronRight size={20} className="text-white/40" />
            </div>
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              onClick={() => setLocation("/legal/safety")}
              data-testid="link-safety"
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <Shield size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Essential Oil Safety</p>
                <p className="text-white/50 text-sm">Important guidelines</p>
              </div>
              <ChevronRight size={20} className="text-white/40" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Support</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div 
              className="p-4 flex items-center gap-4 border-b border-white/5 cursor-pointer hover:bg-[#4a1c57] transition-colors"
              onClick={() => setLocation("/learn")}
            >
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <HelpCircle size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Help & FAQs</p>
                <p className="text-white/50 text-sm">Learn how Olfly works</p>
              </div>
              <ChevronRight size={20} className="text-white/40" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSignOut}
            className="w-full p-4 bg-[#3b1645] rounded-2xl flex items-center justify-center gap-3 text-red-400 hover:bg-[#4a1c57] transition-colors"
            data-testid="button-sign-out"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        <p className="text-center text-white/30 text-sm">
          Olfly v1.0.0
        </p>
      </div>

      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="bg-[#1a1a2e] border-white/10 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Edit Reminder Times</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="morning" className="text-white/70">Morning Reminder</Label>
              <input
                id="morning"
                type="time"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#3b1645] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ac41c3]"
                data-testid="input-morning-time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evening" className="text-white/70">Evening Reminder</Label>
              <input
                id="evening"
                type="time"
                value={eveningTime}
                onChange={(e) => setEveningTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#3b1645] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ac41c3]"
                data-testid="input-evening-time"
              />
            </div>
            <Button
              onClick={() => updateTimesMutation.mutate({ morningTime, eveningTime })}
              disabled={updateTimesMutation.isPending}
              className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-medium py-3"
              data-testid="button-save-times"
            >
              {updateTimesMutation.isPending ? "Saving..." : "Save Times"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
