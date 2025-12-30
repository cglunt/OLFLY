import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  getNotificationPermission,
  requestNotificationPermission,
  saveReminderSettings,
  getReminderSettings,
  scheduleReminders,
  cancelReminders,
  isNotificationSupported,
} from '@/lib/notifications';
import type { User } from '@shared/schema';

interface UseRemindersOptions {
  user: User | null | undefined;
  queryKey: (string | undefined)[];
}

export function useReminders({ user, queryKey }: UseRemindersOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const settings = getReminderSettings();
    if (user.remindersEnabled && permissionStatus === 'granted') {
      scheduleReminders(
        user.morningTime || settings.morningTime,
        user.eveningTime || settings.eveningTime
      );
    } else {
      cancelReminders();
    }
  }, [user?.remindersEnabled, user?.morningTime, user?.eveningTime, permissionStatus]);

  const updateRemindersMutation = useMutation({
    mutationFn: (enabled: boolean) => updateUser(user!.id, { remindersEnabled: enabled }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKey, updatedUser);
      saveReminderSettings({ 
        remindersEnabled: updatedUser.remindersEnabled,
        morningTime: updatedUser.morningTime || '08:00',
        eveningTime: updatedUser.eveningTime || '20:00',
      });
      
      if (updatedUser.remindersEnabled && permissionStatus === 'granted') {
        toast({
          title: "Reminders set",
          description: "We'll take it from here.",
        });
      }
    },
  });

  const updateTimesMutation = useMutation({
    mutationFn: (times: { morningTime: string; eveningTime: string }) => 
      updateUser(user!.id, times),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKey, updatedUser);
      saveReminderSettings({
        morningTime: updatedUser.morningTime || '08:00',
        eveningTime: updatedUser.eveningTime || '20:00',
      });
    },
  });

  const handleToggleReminders = async (enabled: boolean) => {
    if (enabled) {
      const currentPermission = getNotificationPermission();
      
      if (currentPermission === 'unsupported') {
        toast({
          title: "Notifications not supported",
          description: "Your browser doesn't support notifications.",
          variant: "destructive",
        });
        return;
      }
      
      if (currentPermission === 'default') {
        setShowPermissionDialog(true);
        return;
      }
      
      if (currentPermission === 'denied') {
        toast({
          title: "Notifications blocked",
          description: "Enable notifications in your browser settings.",
          variant: "destructive",
        });
        return;
      }
      
      updateRemindersMutation.mutate(true);
    } else {
      updateRemindersMutation.mutate(false);
    }
  };

  const handleAllowPermission = async () => {
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);
    setShowPermissionDialog(false);
    
    if (permission === 'granted') {
      updateRemindersMutation.mutate(true);
    } else {
      toast({
        title: "Permission denied",
        description: "You can enable notifications later in Settings.",
      });
    }
  };

  const handleNotNow = () => {
    setShowPermissionDialog(false);
  };

  const getReminderStatus = () => {
    if (!isNotificationSupported()) {
      return { text: "Not supported", color: "text-white/50", isEnabled: false };
    }
    if (permissionStatus === 'denied') {
      return { text: "Permission denied", color: "text-red-400", isEnabled: false };
    }
    if (!user?.remindersEnabled) {
      return { text: "Disabled", color: "text-white/50", isEnabled: false };
    }
    return { text: "Enabled", color: "text-green-400", isEnabled: true };
  };

  return {
    permissionStatus,
    showPermissionDialog,
    setShowPermissionDialog,
    updateRemindersMutation,
    updateTimesMutation,
    handleToggleReminders,
    handleAllowPermission,
    handleNotNow,
    getReminderStatus,
    isSupported: isNotificationSupported(),
    isEnabled: user?.remindersEnabled && permissionStatus === 'granted',
  };
}
