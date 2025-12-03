import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStoredData, saveStoredData } from "@/lib/data";
import { useLocation } from "wouter";
import { Play, CheckCircle2, Calendar, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [data, setData] = useState(getStoredData());
  const [, setLocation] = useLocation();
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const isSessionCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return data.logs.some((log: any) => log.date.startsWith(today));
  };

  const completedToday = isSessionCompletedToday();

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <p className="text-muted-foreground font-medium">{greeting},</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Ready to smell?</h1>
        </header>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-accent/20 border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">{data.settings.streak}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-400">
                <Trophy size={24} fill="currentColor" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Progress</h2>
            <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
              {completedToday ? "Completed" : "Pending"}
            </span>
          </div>

          {completedToday ? (
            <Card className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">Great job!</h3>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">You've completed your daily training.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-muted-foreground/20 shadow-none">
              <CardContent className="p-6 text-center space-y-4">
                <p className="text-muted-foreground text-sm">
                  Consistent practice is key to recovery.
                </p>
                <Button 
                  size="lg" 
                  className="w-full rounded-full text-lg h-14 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  onClick={() => setLocation("/training")}
                >
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Daily Affirmation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/50 rounded-2xl p-6 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <p className="italic text-muted-foreground font-medium leading-relaxed">
            "Every small step is progress. Trust your body's ability to heal and reconnect."
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/50">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">{data.logs.length}</span>
              <span className="text-xs text-muted-foreground">Total Sessions</span>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">4</span>
              <span className="text-xs text-muted-foreground">Active Scents</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
