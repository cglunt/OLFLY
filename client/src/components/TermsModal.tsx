import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";

const TERMS_VERSION = "1.0";

export function TermsModal() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const termsAccepted = localStorage.getItem("termsAccepted");
    const storedVersion = localStorage.getItem("termsVersion");
    
    if (termsAccepted !== "true" || storedVersion !== TERMS_VERSION) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    localStorage.setItem("termsAcceptedAt", new Date().toISOString());
    localStorage.setItem("termsVersion", TERMS_VERSION);
    setOpen(false);
  };

  if (showTerms) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="bg-[#0c0c1d] border-[#3b1645] w-[calc(100%-2rem)] max-w-sm mx-auto rounded-2xl p-5 max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Terms of Use</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-2 text-white/80 text-xs leading-relaxed">
            <section>
              <h3 className="font-bold text-white text-sm mb-1">Medical Disclaimer</h3>
              <p>Olfly provides educational and wellness support only. It does not provide medical advice, diagnosis, or treatment.</p>
            </section>
            <section>
              <h3 className="font-bold text-white text-sm mb-1">No Guarantee of Results</h3>
              <p>Results vary by person. Olfly does not guarantee improvement or restoration of smell or taste.</p>
            </section>
            <section>
              <h3 className="font-bold text-white text-sm mb-1">Essential Oil Safety</h3>
              <p>Use essential oils with care. Do not ingest oils. Avoid direct skin contact unless diluted.</p>
            </section>
            <section>
              <h3 className="font-bold text-white text-sm mb-1">Not for Emergency Use</h3>
              <p>Olfly is not for emergency use. If you have severe symptoms, seek immediate medical care.</p>
            </section>
            <section>
              <h3 className="font-bold text-white text-sm mb-1">User Responsibilities</h3>
              <p>You are responsible for how you use information in the app and for your health decisions.</p>
            </section>
          </div>
          
          <Button 
            onClick={() => setShowTerms(false)}
            className="w-full h-10 rounded-xl bg-[#3b1645] text-white hover:bg-[#4a1c57] font-bold text-sm"
          >
            Back to acceptance
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-[#0c0c1d] border-[#3b1645] w-[calc(100%-2rem)] max-w-sm mx-auto rounded-2xl p-5">
        <DialogHeader className="space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-lg font-bold text-white text-center">Before you start</DialogTitle>
          <DialogDescription className="text-white/70 text-center text-sm">
            Please review and accept our terms
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-3">
          <div className="bg-[#3b1645] rounded-xl p-3">
            <p className="text-white/80 text-xs leading-relaxed">
              Olfly provides educational and wellness support only. It does not provide medical advice, 
              diagnosis, or treatment. If you have questions about symptoms or your health, talk with 
              a qualified healthcare professional.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <Checkbox 
              id="modal-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="mt-0.5 border-white/30 data-[state=checked]:bg-[#ac41c3] data-[state=checked]:border-[#ac41c3] h-4 w-4"
            />
            <label htmlFor="modal-terms" className="text-white/70 text-xs leading-relaxed cursor-pointer">
              I understand Olfly is for educational and wellness support only and not medical advice.
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleAccept}
            disabled={!accepted}
            className="w-full h-11 rounded-xl bg-[#ac41c3] text-white hover:bg-[#9e3bb3] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I agree and continue
          </Button>
          <button 
            onClick={() => setShowTerms(true)}
            className="w-full text-center text-white/50 text-xs hover:text-white/70 transition-colors py-1"
          >
            View full terms
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
