import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getStoredData } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, Activity } from "lucide-react";

export default function Progress() {
  const [data] = useState(getStoredData());
  
  // Transform log data for charts
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

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">Track your recovery journey over time.</p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-secondary/50 rounded-full p-1 mb-6">
            <TabsTrigger value="overview" className="rounded-full w-1/2">Overview</TabsTrigger>
            <TabsTrigger value="history" className="rounded-full w-1/2">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Intensity Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Average Intensity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                        dy={10}
                      />
                      <YAxis 
                        hide 
                        domain={[0, 10]} 
                      />
                      <Tooltip 
                        cursor={{stroke: 'hsl(var(--primary))', strokeWidth: 2}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="intensity" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3} 
                        dot={{fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4}}
                        activeDot={{r: 6, fill: 'hsl(var(--primary))'}} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Active Streak</div>
                  <div className="text-2xl font-bold text-primary">{data.settings.streak} Days</div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-none">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Total Sessions</div>
                  <div className="text-2xl font-bold">{data.logs.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Recent Logs</h3>
              {data.logs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No logs yet. Start training!</div>
              ) : (
                data.logs.map((log: any) => (
                  <Card key={log.id} className="hover:bg-secondary/20 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{new Date(log.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                          <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">Completed</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
