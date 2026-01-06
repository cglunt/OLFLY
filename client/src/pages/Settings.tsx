import { useState } from "react";
import Layout from "@/components/Layout";
import { ChevronRight, User, Bell, Shield, FileText, HelpCircle, LogOut, RotateCcw, Clock, AlertCircle, CheckCircle, Volume2 } from "lucide-react";
import { useLocation } from "wouter";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReminderPermissionDialog } from "@/components/ReminderPermissionDialog";
import { useReminders } from "@/hooks/useReminders";
import { isNotificationSupported, cancelReminders } from "@/lib/notifications";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user: firebaseUser, logOut } = useAuth();
  const { user } = useCurrentUser(firebaseUser?.displayName || undefined);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [morningTime, setMorningTime] = useState("09:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  
  const queryKey = ["currentUser", firebaseUser?.displayName || undefined];

  const {
    permissionStatus,
    showPermissionDialog,
    setShowPermissionDialog,
    updateRemindersMutation,
    updateTimesMutation,
    handleToggleReminders,
    handleAllowPermission,
    handleNotNow,
    getReminderStatus,
    isEnabled,
    isSupported,
  } = useReminders({ user, queryKey });

  const handleOpenReminderDialog = () => {
    if (user) {
      setMorningTime(user.morningTime || "09:00");
      setEveningTime(user.eveningTime || "20:00");
      setShowReminderDialog(true);
    }
  };

  const handleSaveTimes = () => {
    updateTimesMutation.mutate({ morningTime, eveningTime }, {
      onSuccess: () => {
        setShowReminderDialog(false);
        toast({
          title: "Reminder times updated",
          description: `Morning: ${formatTime(morningTime)}, Evening: ${formatTime(eveningTime)}`,
        });
      }
    });
  };

  const handleReplayOnboarding = async () => {
    if (user) {
      const updatedUser = await updateUser(user.id, { hasOnboarded: false });
      queryClient.setQueryData(queryKey, updatedUser);
      setLocation("/launch");
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("olfly_user_id");
      cancelReminders();
      queryClient.clear();
      setLocation("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (!user) return null;

  const reminderStatus = getReminderStatus();

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
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Reminders</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <Bell size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Daily Reminders</p>
                <div className="flex items-center gap-2">
                  {reminderStatus.isEnabled ? (
                    <CheckCircle size={12} className={reminderStatus.color} />
                  ) : permissionStatus === 'denied' || !isSupported ? (
                    <AlertCircle size={12} className={reminderStatus.color} />
                  ) : null}
                  <p className={`text-sm ${reminderStatus.color}`}>{reminderStatus.text}</p>
                </div>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleReminders}
                disabled={updateRemindersMutation.isPending || !isSupported}
                className="data-[state=checked]:bg-[#ac41c3]"
                data-testid="switch-reminders"
              />
            </div>
            
            {permissionStatus === 'denied' && (
              <div className="p-4 bg-red-500/10 border-b border-white/5">
                <p className="text-sm text-red-300">
                  Notifications are off. Enable them in your browser settings to receive reminders.
                </p>
              </div>
            )}
            
            {isEnabled && (
              <>
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-sm">Morning reminder</span>
                    <span className="text-white font-medium">{formatTime(user.morningTime || '08:00')}</span>
                  </div>
                  <p className="text-white/50 text-xs">We'll remind you at {formatTime(user.morningTime || '08:00')}</p>
                </div>
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-sm">Evening reminder</span>
                    <span className="text-white font-medium">{formatTime(user.eveningTime || '20:00')}</span>
                  </div>
                  <p className="text-white/50 text-xs">We'll remind you at {formatTime(user.eveningTime || '20:00')}</p>
                </div>
              </>
            )}
            
            <div 
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#4a1c57] transition-colors"
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
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Preferences</h3>
          <div className="bg-[#3b1645] rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <Volume2 size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Training Sounds</p>
                <p className="text-white/50 text-sm">Play chime during sniffing phase</p>
              </div>
              <Switch
                checked={user.soundEnabled ?? true}
                onCheckedChange={async (checked) => {
                  if (user) {
                    const updated = await updateUser(user.id, { soundEnabled: checked });
                    queryClient.setQueryData(queryKey, updated);
                  }
                }}
                className="data-[state=checked]:bg-[#ac41c3]"
                data-testid="switch-sound"
              />
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
              onClick={() => setLocation("/launch/learn")}
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
              <p className="text-white/50 text-sm">We'll remind you at {formatTime(morningTime)}</p>
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
              <p className="text-white/50 text-sm">We'll remind you at {formatTime(eveningTime)}</p>
            </div>
            <Button
              onClick={handleSaveTimes}
              disabled={updateTimesMutation.isPending}
              className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-medium py-3"
              data-testid="button-save-times"
            >
              {updateTimesMutation.isPending ? "Saving..." : "Save Times"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ReminderPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        onAllow={handleAllowPermission}
        onNotNow={handleNotNow}
      />
    </Layout>
  );
}
