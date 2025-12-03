import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getStoredData } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, Activity, Moon, Zap } from "lucide-react";

export default function Progress() {
  const [data] = useState(getStoredData());
  
  const chartData = data.logs
    .slice(0, 7)
    .reverse()
    .map((log: any) => {
      const ratings = Object.values(log.scentRatings) as number[];
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        date: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
        intensity: avg.toFixed(1),
      };
    });

  // Placeholder data for smooth wave look if real data is empty
  const displayData = chartData.length > 1 ? chartData : [
    { date: 'Mon', intensity: 2 },
    { date: 'Tue', intensity: 4.5 },
    { date: 'Wed', intensity: 3 },
    { date: 'Thu', intensity: 6.5 },
    { date: 'Fri', intensity: 5 },
    { date: 'Sat', intensity: 8 },
    { date: 'Sun', intensity: 7.5 },
  ];

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        <header className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white">Overview</h1>
             <p className="text-muted-foreground">Weekly Analysis</p>
          </div>
          <div className="bg-secondary px-3 py-1.5 rounded-full text-sm font-medium text-white border border-white/5 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-primary"></span>
             Last 7 Days
          </div>
        </header>

        {/* Sleep Analytics Style Card */}
        <Card className="bg-gradient-primary border-none shadow-lg shadow-primary/20 relative overflow-hidden">
           <CardContent className="p-6 relative z-10 flex justify-between items-center">
              <div className="space-y-2">
                 <h3 className="text-white font-bold text-lg leading-tight max-w-[120px]">You almost reached a perfect streak</h3>
                 <p className="text-white/70 text-xs">Keep it up!</p>
              </div>
              <div className="w-20 h-20 relative">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="6" fill="none" strokeDasharray="226" strokeDashoffset="50" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">
                    75%
                 </div>
              </div>
           </CardContent>
           {/* Decor */}
           <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Card>

        {/* Chart Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="bg-secondary/50 px-3 py-1 rounded-lg text-xs font-medium text-white">
                 Avg Intensity
              </div>
           </div>

           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{backgroundColor: 'hsl(240, 18%, 14%)', borderRadius: '12px', border: 'none', color: 'white'}}
                    itemStyle={{color: 'hsl(280, 80%, 60%)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="hsl(280, 80%, 60%)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorIntensity)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Selected Point Indicator (Fake) */}
              <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="bg-white text-background text-xs font-bold px-2 py-1 rounded-full mb-2 shadow-lg">
                    7.5 Intense
                 </div>
                 <div className="w-4 h-4 bg-white border-4 border-primary rounded-full shadow-[0_0_15px_hsl(280,80%,60%)]"></div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-secondary rounded-[1.5rem] p-5 flex flex-col gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                 <Moon size={20} />
              </div>
              <div>
                 <p className="text-muted-foreground text-xs">Total Sessions</p>
                 <p className="text-2xl font-bold text-white">{data.logs.length}</p>
              </div>
           </div>
           <div className="bg-secondary rounded-[1.5rem] p-5 flex flex-col gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                 <Zap size={20} />
              </div>
              <div>
                 <p className="text-muted-foreground text-xs">Active Streak</p>
                 <p className="text-2xl font-bold text-white">{data.settings.streak}</p>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
}
