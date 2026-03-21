import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind, Droplets, Zap, Ghost, FlaskConical, Trash2, Plus, X,
  ChevronDown, ChevronUp, BookOpen,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { createSymptomLog, getUserSymptomLogs, deleteSymptomLog } from "@/lib/api";
import type { SymptomLog } from "@shared/schema";

// ── Helpers ──────────────────────────────────────────────────────────────────

function SliderField({
  label,
  icon: Icon,
  value,
  onChange,
  lowLabel,
  highLabel,
  color = "#6d45d2",
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
  color?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-white/50" />
          <span className="text-sm text-white/70">{label}</span>
        </div>
        <span
          className="text-sm font-bold w-6 text-right"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${value * 10}%, rgba(255,255,255,0.1) ${value * 10}%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-white/30">{lowLabel}</span>
        <span className="text-[10px] text-white/30">{highLabel}</span>
      </div>
    </div>
  );
}

function Toggle({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all ${
        value
          ? "bg-[#6d45d2]/20 border-[#6d45d2]/50"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={value ? "text-[#db2faa]" : "text-white/40"} />
        <span className={`text-sm font-medium ${value ? "text-white" : "text-white/60"}`}>
          {label}
        </span>
      </div>
      <div
        className={`w-10 h-5 rounded-full transition-all relative ${
          value ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa]" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            value ? "left-5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

const PHANTOM_SUGGESTIONS = [
  "Burning", "Smoke", "Fuel / gasoline", "Garbage", "Rotten", "Floral",
  "Sweet", "Chemical", "Metallic", "Random / can't place it",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value * 10}%`, background: color }}
        />
      </div>
      <span className="text-xs text-white/50 w-4 text-right">{value}</span>
    </div>
  );
}

// ── Entry Card ────────────────────────────────────────────────────────────────

function EntryCard({
  log,
  onDelete,
}: {
  log: SymptomLog;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden"
    >
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-xs text-white/40 mb-1">{formatDate(log.createdAt as unknown as string)}</p>
          <div className="flex gap-3 flex-wrap">
            <span className="text-sm text-white/70">
              Smell <span className="font-bold text-white">{log.smellStrength}/10</span>
            </span>
            <span className="text-sm text-white/70">
              Taste <span className="font-bold text-white">{log.tasteChanges}/10</span>
            </span>
            {log.phantomSmells && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#db2faa]/20 text-[#db2faa] border border-[#db2faa]/30">
                Phantom smell
              </span>
            )}
            {log.distortions && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#6d45d2]/20 text-[#a78bfa] border border-[#6d45d2]/30">
                Distortion
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-white/30 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-white/30 shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Smell strength</p>
                  <ScoreBar value={log.smellStrength} color="#db2faa" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Nasal congestion</p>
                  <ScoreBar value={log.nasalCongestion ?? 0} color="#6d45d2" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Taste quality</p>
                  <ScoreBar value={log.tasteChanges} color="#db2faa" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Taste intensity</p>
                  <ScoreBar value={log.tasteIntensity ?? 5} color="#6d45d2" />
                </div>
              </div>

              {log.phantomSmells && log.phantomSmellDescription && (
                <div className="bg-[#db2faa]/10 rounded-xl p-3 border border-[#db2faa]/20">
                  <p className="text-[10px] text-[#db2faa] uppercase tracking-wider mb-1">Phantom smell</p>
                  <p className="text-sm text-white/80">{log.phantomSmellDescription}</p>
                </div>
              )}

              {log.distortions && log.parosmiaDescription && (
                <div className="bg-[#6d45d2]/10 rounded-xl p-3 border border-[#6d45d2]/20">
                  <p className="text-[10px] text-[#a78bfa] uppercase tracking-wider mb-1">Smell distortion</p>
                  <p className="text-sm text-white/80">{log.parosmiaDescription}</p>
                </div>
              )}

              {log.notes && (
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-white/70">{log.notes}</p>
                </div>
              )}

              {/* Delete */}
              <div className="pt-1">
                {confirming ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={onDelete}
                      className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 rounded-xl"
                    >
                      Yes, delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setConfirming(false)}
                      className="flex-1 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(true)}
                    className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete entry
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── New Entry Form ────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  smellStrength: 5,
  nasalCongestion: 0,
  tasteChanges: 5,
  tasteIntensity: 5,
  distortions: false,
  parosmiaDescription: "",
  phantomSmells: false,
  phantomSmellDescription: "",
  notes: "",
};

function NewEntryForm({
  userId,
  onSaved,
  onCancel,
}: {
  userId: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = <K extends keyof typeof DEFAULT_FORM>(key: K, value: (typeof DEFAULT_FORM)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: () =>
      createSymptomLog(userId, {
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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-[#1a1a2e] rounded-2xl border border-[#6d45d2]/30 p-5 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">New journal entry</h3>
        <button onClick={onCancel} className="text-white/30 hover:text-white/60">
          <X size={18} />
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <SliderField
          label="Smell strength"
          icon={Wind}
          value={form.smellStrength}
          onChange={(v) => set("smellStrength", v)}
          lowLabel="None"
          highLabel="Normal"
          color="#db2faa"
        />
        <SliderField
          label="Nasal congestion"
          icon={Droplets}
          value={form.nasalCongestion}
          onChange={(v) => set("nasalCongestion", v)}
          lowLabel="Clear"
          highLabel="Blocked"
          color="#6d45d2"
        />
        <SliderField
          label="Taste quality"
          icon={FlaskConical}
          value={form.tasteChanges}
          onChange={(v) => set("tasteChanges", v)}
          lowLabel="Very off"
          highLabel="Normal"
          color="#db2faa"
        />
        <SliderField
          label="Taste intensity"
          icon={Zap}
          value={form.tasteIntensity}
          onChange={(v) => set("tasteIntensity", v)}
          lowLabel="Tasteless"
          highLabel="Strong"
          color="#6d45d2"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <Toggle
          label="Smell distortion (parosmia)"
          icon={FlaskConical}
          value={form.distortions}
          onChange={(v) => set("distortions", v)}
        />
        <AnimatePresence>
          {form.distortions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={form.parosmiaDescription}
                onChange={(e) => set("parosmiaDescription", e.target.value)}
                placeholder='Describe it — e.g. "coffee smells like fuel", "meat smells rotten"'
                rows={2}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-[#6d45d2]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Toggle
          label="Phantom smell (nothing there)"
          icon={Ghost}
          value={form.phantomSmells}
          onChange={(v) => set("phantomSmells", v)}
        />
        <AnimatePresence>
          {form.phantomSmells && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2"
            >
              <input
                type="text"
                value={form.phantomSmellDescription}
                onChange={(e) => set("phantomSmellDescription", e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="What does it smell like? (or tap a suggestion)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#db2faa]"
              />
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {PHANTOM_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => set("phantomSmellDescription", s)}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#db2faa]/15 border border-[#db2faa]/30 text-[#db2faa] hover:bg-[#db2faa]/25 transition-colors"
                      >
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

      {/* Notes */}
      <div>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any other notes (optional)"
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-[#6d45d2]"
        />
      </div>

      {mutation.isError && (
        <p className="text-red-400 text-xs text-center">Something went wrong — please try again.</p>
      )}

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] hover:opacity-90 text-white font-bold rounded-full py-3 disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save entry"}
      </Button>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Journal() {
  const { user: firebaseUser } = useAuth();
  const { user } = useCurrentUser(firebaseUser?.uid);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: logs = [], isLoading } = useQuery<SymptomLog[]>({
    queryKey: ["symptom-logs", user?.id],
    queryFn: () => getUserSymptomLogs(user!.id, 50),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (logId: string) => deleteSymptomLog(user!.id, logId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptom-logs", user?.id] }),
  });

  if (!user) return null;

  return (
    <Layout showBack backPath="/launch/progress">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-[#db2faa]" />
              <h1 className="text-xl font-bold">Symptom Journal</h1>
            </div>
            <p className="text-white/40 text-sm">Track how your senses feel day to day</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6d45d2] to-[#db2faa] flex items-center justify-center shadow-lg shadow-[#6d45d2]/30 hover:opacity-90 transition-opacity"
            >
              <Plus size={20} className="text-white" />
            </button>
          )}
        </div>

        {/* New entry form */}
        <AnimatePresence>
          {showForm && (
            <div className="mb-5">
              <NewEntryForm
                userId={user.id}
                onSaved={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Entries */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6d45d2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-3"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <BookOpen size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">No entries yet</p>
            <p className="text-white/25 text-xs">Tap + to log your first entry</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
              {logs.length} {logs.length === 1 ? "entry" : "entries"}
            </p>
            <AnimatePresence>
              {logs.map((log) => (
                <EntryCard
                  key={log.id}
                  log={log}
                  onDelete={() => deleteMutation.mutate(log.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
