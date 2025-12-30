import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ReminderPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAllow: () => void;
  onNotNow: () => void;
}

export function ReminderPermissionDialog({
  open,
  onOpenChange,
  onAllow,
  onNotNow,
}: ReminderPermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a2e] border-white/10 text-white max-w-sm mx-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-white text-xl">Want a reminder to train?</DialogTitle>
          <DialogDescription className="text-white/70 text-base">
            Consistent practice matters. Olfly can remind you when it's time to train.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={onAllow}
            className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-medium py-6"
            data-testid="button-allow-reminders"
          >
            Allow reminders
          </Button>
          <Button
            onClick={onNotNow}
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 py-6"
            data-testid="button-not-now"
          >
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
