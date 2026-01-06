import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useAuth } from "@/lib/useAuth";
import { getUserSessions, getUserSymptomLogs, createSymptomLog } from "@/lib/api";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Moon, Zap, TrendingUp, AlertCircle, Plus, X, Check, Heart, Share2, Sparkles, Calendar, Star } from "lucide-react";
import type { Session, SymptomLog } from "@shared/schema";
import { useProgressUpdates } from "@/hooks/useProgressUpdates";
import { ProgressShareCard } from "@/components/ProgressShareCard";

export default function Progress() {
  const { user: firebaseUser } = useAuth();
  const { user } = useCurrentUser(firebaseUser?.displayName || undefined);
  const queryClient = useQueryClient();
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [smellStrength, setSmellStrength] = useState(5);
  const [tasteChanges, setTasteChanges] = useState(5);
  const [distortions, setDistortions] = useState(false);
  const [phantomSmells, setPhantomSmells] = useState(false);
  const [notes, setNotes] = useState("");
  const [shareCardOpen, setShareCardOpen] = useState(false);
  const [shareContent, setShareContent] = useState<{ type: 'statement' | 'milestone' | 'moment'; title: string; subtitle?: string } | null>(null);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: () => getUserSessions(user!.id),
    enabled: !!user,
  });

  const { data: symptomLogs = [] } = useQuery({
    queryKey: ["symptomLogs", user?.id],
    queryFn: () => getUserSymptomLogs(user!.id),
    enabled: !!user,
  });

  const {
    supportStatements,
    favoriteStatements,
    toggleFavorite,
    journeyMilestones,
    progressMoments,
    daysSinceStart,
  } = useProgressUpdates(sessions);

  const createLogMutation = useMutation({
    mutationFn: createSymptomLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptomLogs", user?.id] });
      setShowSymptomForm(false);
      setSmellStrength(5);
      setTasteChanges(5);
      setDistortions(false);
      setPhantomSmells(false);
      setNotes("");
    },
  });

  const handleSubmitSymptomLog = () => {
    if (!user) return;
    createLogMutation.mutate({
      userId: user.id,
      smellStrength,
      tasteChanges,
      distortions,
      phantomSmells,
      notes: notes || null,
    });
  };

  const handleShare = (type: 'statement' | 'milestone' | 'moment', title: string, subtitle?: string) => {
    setShareContent({ type, title, subtitle });
    setShareCardOpen(true);
  };

  const chartData = sessions
    .slice(0, 7)
    .reverse()
    .map((session: Session) => {
      const ratings = Object.values(session.scentRatings) as number[];
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        date: new Date(session.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
        intensity: parseFloat(avg.toFixed(1)),
      };
    });

  const displayData = chartData;

  const avgIntensity = chartData.length > 0 
    ? (chartData.reduce((sum, d) => sum + d.intensity, 0) / chartData.length).toFixed(1)
    : "0";

  const weeklyGoal = 7;
  const completedThisWeek = sessions.filter((s: Session) => {
    const sessionDate = new Date(s.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo && s.completed;
  }).length;
  const progressPercent = Math.min(100, Math.round((completedThisWeek / weeklyGoal) * 100));

  const getMotivationalMessage = () => {
    if (progressPercent >= 100) return "Perfect week! You're a smell training champion!";
    if (progressPercent >= 70) return "Almost there! Keep up the great work!";
    if (progressPercent >= 50) return "Halfway through your weekly goal!";
    if (progressPercent >= 25) return "Good start! Keep building momentum!";
    return "Every session counts. You've got this!";
  };

  const reachedMilestones = journeyMilestones.filter(m => m.reached);
  const upcomingMilestones = journeyMilestones.filter(m => !m.reached);

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white" data-testid="text-page-title">Overview</h1>
            <p className="text-white/70">Weekly Analysis</p>
          </div>
          <div className="bg-[#3b1645] px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ac41c3]"></span>
            Last 7 Days
          </div>
        </header>

        <Card className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] border-none shadow-md shadow-black/40 relative overflow-hidden rounded-2xl">
          <CardContent className="p-6 relative z-10 flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-white font-bold text-xl leading-tight max-w-[140px]">{getMotivationalMessage()}</h3>
              <p className="text-white/80 text-sm">{completedThisWeek} of {weeklyGoal} sessions</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke="white" strokeWidth="6" fill="none" 
                  strokeDasharray="251" 
                  strokeDashoffset={251 - (251 * progressPercent / 100)} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg" data-testid="text-progress-percent">
                {progressPercent}%
              </div>
            </div>
          </CardContent>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </Card>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-[#db2faa]" />
              Progress Updates
            </h2>
            <p className="text-white/50 text-sm mt-1">Gentle check-ins to help you notice progress over time.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white/80 font-medium text-sm">Support statements</h3>
              <span className="text-white/40 text-xs">Save one that fits today</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {supportStatements.map((statement, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#3b1645] rounded-xl p-4 min-w-[200px] flex flex-col gap-3 shrink-0"
                  data-testid={`statement-card-${idx}`}
                >
                  <p className="text-white text-sm font-medium leading-relaxed">{statement}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(statement)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                        favoriteStatements.includes(statement)
                          ? 'bg-[#ac41c3] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                      data-testid={`button-save-${idx}`}
                    >
                      <Heart size={14} className={favoriteStatements.includes(statement) ? 'fill-current' : ''} />
                      {favoriteStatements.includes(statement) ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => handleShare('statement', statement)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                      data-testid={`button-share-statement-${idx}`}
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white/80 font-medium text-sm flex items-center gap-2">
                <Calendar size={16} className="text-[#ac41c3]" />
                Journey milestones
              </h3>
              {daysSinceStart > 0 && (
                <span className="text-white/40 text-xs">Day {daysSinceStart}</span>
              )}
            </div>
            <div className="bg-[#3b1645] rounded-xl p-4 space-y-3">
              {reachedMilestones.length > 0 ? (
                reachedMilestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="text-white text-sm">{milestone.label}</span>
                    </div>
                    <button
                      onClick={() => handleShare('milestone', milestone.label, `Day ${milestone.days} milestone`)}
                      className="text-white/40 hover:text-white/70 transition-colors"
                      data-testid={`button-share-milestone-${milestone.id}`}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white/50 text-sm text-center py-2">
                  Start your first session to begin tracking milestones.
                </p>
              )}
              {upcomingMilestones.length > 0 && reachedMilestones.length > 0 && (
                <div className="border-t border-white/10 pt-3 mt-3">
                  <p className="text-white/40 text-xs mb-2">Upcoming</p>
                  {upcomingMilestones.slice(0, 2).map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Calendar size={14} className="text-white/40" />
                      </div>
                      <span className="text-white/40 text-sm">{milestone.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-white/80 font-medium text-sm flex items-center gap-2">
              <Star size={16} className="text-[#db2faa]" />
              Progress moments
            </h3>
            <p className="text-white/40 text-xs -mt-2">Small changes you might miss.</p>
            <div className="bg-[#3b1645] rounded-xl p-4 space-y-3">
              {progressMoments.length > 0 ? (
                progressMoments.map((moment) => (
                  <div key={moment.id} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{moment.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{moment.detail}</p>
                    </div>
                    <button
                      onClick={() => handleShare('moment', moment.title, moment.detail)}
                      className="text-white/40 hover:text-white/70 transition-colors shrink-0 mt-0.5"
                      data-testid={`button-share-moment-${moment.id}`}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                ))
              ) : sessions.length === 0 ? (
                <p className="text-white/50 text-sm text-center py-2">
                  Start your first session to see progress moments.
                </p>
              ) : (
                <p className="text-white/50 text-sm text-center py-2">
                  You are building your baseline. Keep going!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="bg-[#3b1645] px-3 py-1 rounded-lg text-xs font-medium text-white">
              Avg Intensity: {avgIntensity}
            </div>
          </div>

          <div className="h-[200px] w-full relative bg-[#3b1645] rounded-2xl p-4 shadow-md">
            {displayData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <TrendingUp size={32} className="text-white/30 mb-3" />
                <p className="text-white/50 text-sm">No sessions yet</p>
                <p className="text-white/30 text-xs mt-1">Complete training sessions to see your progress chart</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ac41c3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ac41c3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0c0c1d', borderRadius: '12px', border: 'none', color: 'white'}}
                  itemStyle={{color: '#ac41c3'}}
                  formatter={(value: number) => [`${value} intensity`, 'Rating']}
                />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#ac41c3" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIntensity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#3b1645] rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center text-[#db2faa]">
              <Moon size={20} />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Total Sessions</p>
              <p className="text-2xl font-bold text-white" data-testid="text-total-sessions">{sessions.length}</p>
            </div>
          </div>
          <div className="bg-[#3b1645] rounded-2xl p-5 flex flex-col gap-3 shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center text-[#ac41c3]">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Active Streak</p>
              <p className="text-2xl font-bold text-white" data-testid="text-streak">{user?.streak || 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle size={20} className="text-[#ac41c3]" />
              Symptom Tracking
            </h2>
            <Button
              onClick={() => setShowSymptomForm(!showSymptomForm)}
              size="sm"
              className="bg-[#3b1645] hover:bg-[#4a1d58] text-white rounded-xl"
              data-testid="button-add-symptom"
            >
              {showSymptomForm ? <X size={16} /> : <Plus size={16} />}
            </Button>
          </div>

          {showSymptomForm && (
            <Card className="bg-[#3b1645] border-none rounded-2xl">
              <CardContent className="p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white/80 text-sm">Smell Strength</label>
                    <span className="text-white font-bold">{smellStrength}/10</span>
                  </div>
                  <Slider
                    value={[smellStrength]}
                    onValueChange={([v]) => setSmellStrength(v)}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                    data-testid="slider-smell-strength"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white/80 text-sm">Taste Changes</label>
                    <span className="text-white font-bold">{tasteChanges}/10</span>
                  </div>
                  <Slider
                    value={[tasteChanges]}
                    onValueChange={([v]) => setTasteChanges(v)}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                    data-testid="slider-taste-changes"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-white/80 text-sm">Smell Distortions</label>
                  <Switch
                    checked={distortions}
                    onCheckedChange={setDistortions}
                    className="data-[state=checked]:bg-[#ac41c3]"
                    data-testid="switch-distortions"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-white/80 text-sm">Phantom Smells</label>
                  <Switch
                    checked={phantomSmells}
                    onCheckedChange={setPhantomSmells}
                    className="data-[state=checked]:bg-[#ac41c3]"
                    data-testid="switch-phantom-smells"
                  />
                </div>

                <Textarea
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#0c0c1d] border-white/10 text-white placeholder:text-white/40 rounded-xl"
                  data-testid="input-notes"
                />

                <Button
                  onClick={handleSubmitSymptomLog}
                  disabled={createLogMutation.isPending}
                  className="w-full bg-[#ac41c3] hover:bg-[#9e3bb3] text-white rounded-xl h-12"
                  data-testid="button-submit-symptom"
                >
                  <Check size={18} className="mr-2" />
                  {createLogMutation.isPending ? "Saving..." : "Save Log"}
                </Button>
              </CardContent>
            </Card>
          )}

          {symptomLogs.length > 0 && (
            <div className="space-y-3">
              {symptomLogs.slice(0, 5).map((log: SymptomLog) => (
                <div key={log.id} className="bg-[#3b1645]/50 rounded-xl p-4 space-y-2" data-testid={`symptom-log-${log.id}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {log.distortions && (
                        <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded">Distortions</span>
                      )}
                      {log.phantomSmells && (
                        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded">Phantom</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-[#ac41c3]" />
                      <span className="text-white text-sm">Smell: {log.smellStrength}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">Taste: {log.tasteChanges}/10</span>
                    </div>
                  </div>
                  {log.notes && (
                    <p className="text-white/60 text-sm">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {symptomLogs.length === 0 && !showSymptomForm && (
            <div className="bg-[#3b1645]/30 rounded-xl p-6 text-center">
              <p className="text-white/60 text-sm">Track your daily symptoms to see patterns over time</p>
              <Button
                onClick={() => setShowSymptomForm(true)}
                variant="link"
                className="text-[#ac41c3] mt-2"
              >
                Add your first log
              </Button>
            </div>
          )}
        </div>
      </div>

      {shareContent && (
        <ProgressShareCard
          isOpen={shareCardOpen}
          onClose={() => {
            setShareCardOpen(false);
            setShareContent(null);
          }}
          type={shareContent.type}
          title={shareContent.title}
          subtitle={shareContent.subtitle}
          soundEnabled={user?.soundEnabled !== false}
        />
      )}
    </Layout>
  );
}
