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
        <DialogContent className="bg-[#0c0c1d] border-[#3b1645] max-w-md mx-4 rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Terms of Use</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 text-white/80 text-sm leading-relaxed">
            <section>
              <h3 className="font-bold text-white mb-2">Medical Disclaimer</h3>
              <p>Olfly provides educational and wellness support only. It does not provide medical advice, diagnosis, or treatment.</p>
            </section>
            <section>
              <h3 className="font-bold text-white mb-2">No Guarantee of Results</h3>
              <p>Results vary by person. Olfly does not guarantee improvement or restoration of smell or taste.</p>
            </section>
            <section>
              <h3 className="font-bold text-white mb-2">Essential Oil Safety</h3>
              <p>Use essential oils with care. Do not ingest oils. Avoid direct skin contact unless diluted.</p>
            </section>
            <section>
              <h3 className="font-bold text-white mb-2">Not for Emergency Use</h3>
              <p>Olfly is not for emergency use. If you have severe symptoms, seek immediate medical care.</p>
            </section>
            <section>
              <h3 className="font-bold text-white mb-2">User Responsibilities</h3>
              <p>You are responsible for how you use information in the app and for your health decisions.</p>
            </section>
          </div>
          
          <Button 
            onClick={() => setShowTerms(false)}
            className="w-full h-12 rounded-xl bg-[#3b1645] text-white hover:bg-[#4a1c57] font-bold"
          >
            Back to acceptance
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-[#0c0c1d] border-[#3b1645] max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-white text-center">Before you start</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Please review and accept our terms
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-[#3b1645] rounded-xl p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              Olfly provides educational and wellness support only. It does not provide medical advice, 
              diagnosis, or treatment. If you have questions about symptoms or your health, talk with 
              a qualified healthcare professional.
            </p>
          </div>
          
          <div className="flex items-start gap-3 px-1">
            <Checkbox 
              id="modal-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
              className="mt-1 border-white/30 data-[state=checked]:bg-[#ac41c3] data-[state=checked]:border-[#ac41c3]"
            />
            <label htmlFor="modal-terms" className="text-white/70 text-sm leading-relaxed cursor-pointer">
              I understand Olfly is for educational and wellness support only and not medical advice.
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleAccept}
            disabled={!accepted}
            className="w-full h-12 rounded-xl bg-[#ac41c3] text-white hover:bg-[#9e3bb3] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I agree and continue
          </Button>
          <button 
            onClick={() => setShowTerms(true)}
            className="w-full text-center text-white/50 text-sm hover:text-white/70 transition-colors"
          >
            View full terms
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
