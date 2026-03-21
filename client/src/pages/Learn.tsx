import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain, ShieldAlert, Flame, FileText, Droplets, ChevronRight,
  BookOpen, Plus, X, Wind, Zap, Ghost, FlaskConical, ChevronDown, ChevronUp, Trash2,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/useAuth";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { createSymptomLog, getUserSymptomLogs, deleteSymptomLog } from "@/lib/api";
import type { SymptomLog } from "@shared/schema";

// ── Shared journal helpers (duplicated from Journal.tsx for self-contained page) ──

const PHANTOM_SUGGESTIONS = [
  "Burning", "Smoke", "Fuel / gasoline", "Garbage", "Rotten",
  "Floral", "Sweet", "Chemical", "Metallic", "Random / can't place it",
];

function SliderField({
  label, icon: Icon, value, onChange, lowLabel, highLabel, color = "#6d45d2",
}: {
  label: string; icon: React.ElementType; value: number;
  onChange: (v: number) => void; lowLabel: string; highLabel: string; color?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-white/50" />
          <span className="text-xs text-white/70">{label}</span>
        </div>
        <span className="text-xs font-bold w-5 text-right" style={{ color }}>{value}</span>
      </div>
      <input
        type="range" min={0} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${value * 10}%, rgba(255,255,255,0.1) ${value * 10}%)` }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-white/30">{lowLabel}</span>
        <span className="text-[10px] text-white/30">{highLabel}</span>
      </div>
    </div>
  );
}

function Toggle({ label, icon: Icon, value, onChange }: {
  label: string; icon: React.ElementType; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all ${
        value ? "bg-[#6d45d2]/20 border-[#6d45d2]/50" : "bg-white/5 border-white/10"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className={value ? "text-[#db2faa]" : "text-white/40"} />
        <span className={`text-xs font-medium ${value ? "text-white" : "text-white/60"}`}>{label}</span>
      </div>
      <div className={`w-9 h-4.5 rounded-full transition-all relative ${value ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa]" : "bg-white/10"}`}
        style={{ height: "18px", width: "36px" }}>
        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${value ? "left-5" : "left-0.5"}`} />
      </div>
    </button>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="text-[10px] text-white/50 w-3 text-right">{value}</span>
    </div>
  );
}

// ── Entry card ────────────────────────────────────────────────────────────────

function EntryCard({ log, onDelete }: { log: SymptomLog; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="bg-[#3b1645] rounded-xl border border-white/5 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="text-[10px] text-white/40 mb-0.5">{formatDate(log.createdAt as unknown as string)}</p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-white/70">Smell <span className="font-bold text-white">{log.smellStrength}/10</span></span>
            <span className="text-xs text-white/70">Taste <span className="font-bold text-white">{log.tasteChanges}/10</span></span>
            {log.phantomSmells && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#db2faa]/20 text-[#db2faa] border border-[#db2faa]/30">Phantom</span>}
            {log.distortions && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#6d45d2]/20 text-[#a78bfa] border border-[#6d45d2]/30">Distortion</span>}
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-white/30 shrink-0" /> : <ChevronDown size={14} className="text-white/30 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-3 space-y-2 border-t border-white/5 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Smell</p><ScoreBar value={log.smellStrength} color="#db2faa" /></div>
                <div><p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Congestion</p><ScoreBar value={log.nasalCongestion ?? 0} color="#6d45d2" /></div>
                <div><p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Taste quality</p><ScoreBar value={log.tasteChanges} color="#db2faa" /></div>
                <div><p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Taste intensity</p><ScoreBar value={log.tasteIntensity ?? 5} color="#6d45d2" /></div>
              </div>
              {log.phantomSmells && log.phantomSmellDescription && (
                <div className="bg-[#db2faa]/10 rounded-lg p-2.5 border border-[#db2faa]/20">
                  <p className="text-[9px] text-[#db2faa] uppercase tracking-wider mb-0.5">Phantom smell</p>
                  <p className="text-xs text-white/80">{log.phantomSmellDescription}</p>
                </div>
              )}
              {log.distortions && log.parosmiaDescription && (
                <div className="bg-[#6d45d2]/10 rounded-lg p-2.5 border border-[#6d45d2]/20">
                  <p className="text-[9px] text-[#a78bfa] uppercase tracking-wider mb-0.5">Distortion</p>
                  <p className="text-xs text-white/80">{log.parosmiaDescription}</p>
                </div>
              )}
              {log.notes && <p className="text-xs text-white/60 italic">{log.notes}</p>}
              <div className="pt-1">
                {confirming ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={onDelete} className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 rounded-lg text-xs h-7">Yes, delete</Button>
                    <Button size="sm" onClick={() => setConfirming(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 rounded-lg text-xs h-7">Cancel</Button>
                  </div>
                ) : (
                  <button onClick={() => setConfirming(true)} className="flex items-center gap-1 text-[10px] text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={10} />Delete entry
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── New entry form ────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  smellStrength: 5, nasalCongestion: 0, tasteChanges: 5, tasteIntensity: 5,
  distortions: false, parosmiaDescription: "",
  phantomSmells: false, phantomSmellDescription: "", notes: "",
};

function NewEntryForm({ userId, onSaved, onCancel }: { userId: string; onSaved: () => void; onCancel: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const set = <K extends keyof typeof DEFAULT_FORM>(key: K, value: (typeof DEFAULT_FORM)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: () => createSymptomLog(userId, {
      userId,
      smellStrength: form.smellStrength,
      nasalCongestion: form.nasalCongestion,
      tasteChanges: form.tasteChanges,
      tasteIntensity: form.tasteIntensity,
      distortions: form.distortions,
      parosmiaDescription: form.distortions && form.parosmiaDescription ? form.parosmiaDescription : null,
      phantomSmells: form.phantomSmells,
      phantomSmellDescription: form.phantomSmells && form.phantomSmellDescription ? form.phantomSmellDescription : null,
      notes: form.notes || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptom-logs", userId] });
      onSaved();
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      className="bg-[#2a1040] rounded-2xl border border-[#6d45d2]/40 p-4 space-y-4 shadow-lg shadow-black/30"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">New entry</h3>
        <button onClick={onCancel} className="text-white/30 hover:text-white/60"><X size={16} /></button>
      </div>

      <div className="space-y-4">
        <SliderField label="Smell strength" icon={Wind} value={form.smellStrength} onChange={(v) => set("smellStrength", v)} lowLabel="None" highLabel="Normal" color="#db2faa" />
        <SliderField label="Nasal congestion" icon={Droplets} value={form.nasalCongestion} onChange={(v) => set("nasalCongestion", v)} lowLabel="Clear" highLabel="Blocked" color="#6d45d2" />
        <SliderField label="Taste quality" icon={FlaskConical} value={form.tasteChanges} onChange={(v) => set("tasteChanges", v)} lowLabel="Very off" highLabel="Normal" color="#db2faa" />
        <SliderField label="Taste intensity" icon={Zap} value={form.tasteIntensity} onChange={(v) => set("tasteIntensity", v)} lowLabel="Tasteless" highLabel="Strong" color="#6d45d2" />
      </div>

      <div className="space-y-2">
        <Toggle label="Smell distortion (parosmia)" icon={FlaskConical} value={form.distortions} onChange={(v) => set("distortions", v)} />
        <AnimatePresence>
          {form.distortions && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <textarea value={form.parosmiaDescription} onChange={(e) => set("parosmiaDescription", e.target.value)}
                placeholder='e.g. "coffee smells like fuel", "meat smells rotten"'
                rows={2} className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-[#6d45d2]" />
            </motion.div>
          )}
        </AnimatePresence>

        <Toggle label="Phantom smell (nothing there)" icon={Ghost} value={form.phantomSmells} onChange={(v) => set("phantomSmells", v)} />
        <AnimatePresence>
          {form.phantomSmells && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1 space-y-1.5">
              <input type="text" value={form.phantomSmellDescription}
                onChange={(e) => set("phantomSmellDescription", e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="What does it smell like?"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#db2faa]" />
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-1">
                    {PHANTOM_SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onMouseDown={() => set("phantomSmellDescription", s)}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#db2faa]/15 border border-[#db2faa]/30 text-[#db2faa] hover:bg-[#db2faa]/25 transition-colors">
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
        placeholder="Any other notes (optional)" rows={2}
        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-[#6d45d2]" />

      {mutation.isError && <p className="text-red-400 text-xs text-center">Something went wrong — please try again.</p>}

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full py-2.5 text-sm disabled:opacity-60">
        {mutation.isPending ? "Saving…" : "Save entry"}
      </Button>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Learn() {
  const [, setLocation] = useLocation();
  const { user: firebaseUser } = useAuth();
  const { user } = useCurrentUser(firebaseUser?.uid);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);

  const { data: logs = [], isLoading: logsLoading } = useQuery<SymptomLog[]>({
    queryKey: ["symptom-logs", user?.id],
    queryFn: () => getUserSymptomLogs(user!.id, 50),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (logId: string) => deleteSymptomLog(user!.id, logId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptom-logs", user?.id] }),
  });

  const visibleLogs = showAllEntries ? logs : logs.slice(0, 3);

  return (
    <Layout>

      {/* ══ Top section — home-screen style ══ */}
      <div className="px-6 pt-6 pb-6 space-y-4">

        {/* Header matching Progress page */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white">Symptom Journal</h1>
            <p className="text-white/60 text-sm">Track how your senses feel</p>
          </div>
          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <div className="bg-[#3b1645] px-3 py-1.5 rounded-xl text-xs font-medium text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#db2faa]" />
                {logs.length} {logs.length === 1 ? "entry" : "entries"}
              </div>
            )}
            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6d45d2] to-[#db2faa] px-4 py-2 rounded-full shadow-md shadow-[#6d45d2]/30 hover:opacity-90 transition-opacity">
                <Plus size={12} />New entry
              </button>
            )}
          </div>
        </header>

        <AnimatePresence>
          {showForm && (
            <NewEntryForm
              userId={user?.id ?? ""}
              onSaved={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        {logsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-[#3b1645] rounded-2xl p-5 text-center">
            <p className="text-white/50 text-sm">No entries yet</p>
            <p className="text-white/30 text-xs mt-1">Tap "New entry" to start tracking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleLogs.map((log) => (
              <EntryCard key={log.id} log={log} onDelete={() => deleteMutation.mutate(log.id)} />
            ))}
            {logs.length > 3 && (
              <button onClick={() => setShowAllEntries(!showAllEntries)}
                className="w-full text-xs text-white/40 hover:text-white/60 py-2 flex items-center justify-center gap-1 transition-colors">
                {showAllEntries ? <><ChevronUp size={12} />Show less</> : <><ChevronDown size={12} />Show all {logs.length} entries</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ══ Bottom section — dark purple floating panel ══ */}
      <div className="bg-[#130822] rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.65)] px-6 pt-8 pb-24 space-y-6">

        {/* Learn header */}
        <header>
          <h1 className="text-2xl font-bold text-white">Learn</h1>
          <p className="text-white/60">Understanding olfactory training and recovery.</p>
        </header>

        <Card className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white border-none shadow-md rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">How it works</h2>
              <p className="text-white/90 leading-relaxed text-sm">
                Olfactory training uses neuroplasticity. By actively sniffing familiar scents and focusing on them, you stimulate the olfactory nerve to regenerate and forge new pathways to the brain.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Common Questions</h3>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">How long does it take?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Recovery is unique to everyone. Some see results in weeks, others in months. Studies suggest sticking with the protocol twice daily for at least 12–16 weeks for best results.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">What if I smell nothing?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                That is completely normal at the start. The exercise is about <em>trying</em> to smell and visualizing the scent. The effort itself stimulates the nerves.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">Can I change scents?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Yes! After 12 weeks, or if you get bored, switching to a new set of 4 scents can help challenge your nose in new ways.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">What is parosmia?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Parosmia is when familiar smells become distorted or unpleasant — coffee smelling like chemicals, for example. It's actually a sign that your olfactory nerves are regenerating and making new connections. Keep training gently through it; it usually improves over time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-none">
              <AccordionTrigger className="bg-[#3b1645] rounded-xl px-4 py-3 text-white hover:no-underline data-[state=open]:rounded-b-none">What is phantosmia?</AccordionTrigger>
              <AccordionContent className="bg-[#3b1645] px-4 pb-4 rounded-b-xl text-white/70">
                Phantosmia means smelling something — often a burning or sweet odour — that isn't actually there. This is common during smell recovery as the nerves rewire. It often fades as progress continues. If it's persistent or distressing, let your doctor know.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Safety Tips</h3>
          <div className="grid gap-4">
            <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 shadow-md">
              <ShieldAlert className="h-6 w-6 text-[#ac41c3] shrink-0" />
              <div>
                <h4 className="font-bold text-white text-base">Don't Sniff Too Hard</h4>
                <p className="text-sm text-white/70">Gentle "bunny sniffs" are better than deep lung-filling inhales. Keep the scent jar 1–2 inches from your nose.</p>
              </div>
            </div>
            <div className="bg-[#3b1645] rounded-2xl p-5 flex gap-4 shadow-md">
              <Flame className="h-6 w-6 text-[#db2faa] shrink-0" />
              <div>
                <h4 className="font-bold text-white text-base">Clean Essential Oils</h4>
                <p className="text-sm text-white/70">If using essential oils, ensure they are high quality. Do not touch the oil to your skin directly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-md"
          onClick={() => setLocation("/legal/safety")} data-testid="card-safety-link">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Droplets size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-base">Essential Oil Safety</h4>
            <p className="text-sm text-white/80">Important guidelines for safe use</p>
          </div>
          <ChevronRight size={20} className="text-white/70" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Discover</h3>
          <div className="bg-[#3b1645] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#4a1c57] transition-colors cursor-pointer shadow-md shadow-black/40"
            onClick={() => setLocation("/launch/article/restoring-smell")} data-testid="card-article-restoring">
            <div className="p-2 bg-[#ac41c3]/20 w-fit rounded-xl mb-3">
              <FileText size={20} className="text-[#ac41c3]" />
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1 uppercase tracking-wide">Essential Read</p>
              <h4 className="font-bold text-white text-base leading-tight">Restoring Your Smell</h4>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
