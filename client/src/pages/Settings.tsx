import Layout from "@/components/Layout";
import { ChevronRight, User, Bell, Shield, FileText, HelpCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const updateRemindersMutation = useMutation({
    mutationFn: (enabled: boolean) => updateUser(user!.id, { remindersEnabled: enabled }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
    },
  });

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
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#ac41c3]/20 flex items-center justify-center">
                <User size={18} className="text-[#ac41c3]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/50 text-sm">Edit profile</p>
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
          <button className="w-full p-4 bg-[#3b1645] rounded-2xl flex items-center justify-center gap-3 text-red-400 hover:bg-[#4a1c57] transition-colors">
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        <p className="text-center text-white/30 text-sm">
          Olfly v1.0.0
        </p>
      </div>
    </Layout>
  );
}
