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
             <p className="text-white/70">Weekly Analysis</p>
          </div>
          <div className="bg-[#3b1645] px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#ac41c3]"></span>
             Last 7 Days
          </div>
        </header>

        {/* Sleep Analytics Style Card */}
        <Card className="bg-gradient-to-r from-[#6d45d2] to-[#db2faa] border-none shadow-md shadow-black/40 relative overflow-hidden rounded-2xl">
           <CardContent className="p-6 relative z-10 flex justify-between items-center">
              <div className="space-y-2">
                 <h3 className="text-white font-bold text-xl leading-tight max-w-[140px]">You almost reached a perfect streak</h3>
                 <p className="text-white/80 text-sm">Keep it up!</p>
              </div>
              <div className="w-24 h-24 relative">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="6" fill="none" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
                    75%
                 </div>
              </div>
           </CardContent>
           {/* Decor */}
           <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </Card>

        {/* Chart Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="bg-[#3b1645] px-3 py-1 rounded-lg text-xs font-medium text-white">
                 Avg Intensity
              </div>
           </div>

           <div className="h-[250px] w-full relative bg-[#3b1645] rounded-2xl p-4 shadow-md">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ac41c3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ac41c3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0c0c1d', borderRadius: '12px', border: 'none', color: 'white'}}
                    itemStyle={{color: '#ac41c3'}}
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
              
              {/* Selected Point Indicator (Fake) */}
              <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                 <div className="bg-white text-[#0c0c1d] text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-lg">
                    7.5 Intense
                 </div>
                 <div className="w-4 h-4 bg-white border-4 border-[#ac41c3] rounded-full shadow-[0_0_15px_#ac41c3]"></div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-[#3b1645] rounded-2xl p-5 flex flex-col gap-3 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center text-[#db2faa]">
                 <Moon size={20} />
              </div>
              <div>
                 <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Total Sessions</p>
                 <p className="text-2xl font-bold text-white">{data.logs.length}</p>
              </div>
           </div>
           <div className="bg-[#3b1645] rounded-2xl p-5 flex flex-col gap-3 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#0c0c1d] flex items-center justify-center text-[#ac41c3]">
                 <Zap size={20} />
              </div>
              <div>
                 <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Active Streak</p>
                 <p className="text-2xl font-bold text-white">{data.settings.streak}</p>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
}
