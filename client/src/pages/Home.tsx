import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStoredData, AVATAR_IMAGE } from "@/lib/data";
import { useLocation } from "wouter";
import { Play, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [data] = useState(getStoredData());
  const [, setLocation] = useLocation();
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header with Avatar */}
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">Start your<br />practice</h1>
          </div>
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={AVATAR_IMAGE} alt="Profile" className="h-full w-full object-cover" />
          </div>
        </header>

        {/* Filter Tabs (Visual only for now) */}
        <div className="flex gap-6 text-sm font-medium text-muted-foreground overflow-x-auto scrollbar-hide pb-2">
          <span className="text-primary border-b-2 border-primary pb-1 cursor-pointer whitespace-nowrap">Balance</span>
          <span className="hover:text-foreground cursor-pointer whitespace-nowrap">Calm & relaxing</span>
          <span className="hover:text-foreground cursor-pointer whitespace-nowrap">Focus</span>
          <span className="hover:text-foreground cursor-pointer whitespace-nowrap">Anxiety</span>
        </div>

        {/* Horizontal Session Cards */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
          {/* Main Training Card */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="min-w-[280px] h-[180px] bg-[#F5D7C4] rounded-[2rem] relative overflow-hidden cursor-pointer shadow-sm"
            onClick={() => setLocation("/training")}
          >
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#3C3C3C]">Daily<br/>Scent Training</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#3C3C3C]/70">
                <span>4 Scents</span>
                <span>•</span>
                <span>5 Min</span>
              </div>
            </div>
            {/* Decorative Illustration */}
            <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-90">
              <img src={data.scents[0].image} className="w-full h-full object-contain mix-blend-multiply" alt="decoration" />
            </div>
          </motion.div>

          {/* Secondary Card */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="min-w-[280px] h-[180px] bg-[#8AC1A2] rounded-[2rem] relative overflow-hidden cursor-pointer shadow-sm"
            onClick={() => setLocation("/training")}
          >
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">Quick<br/>Reset</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/80">
                <span>1 Scent</span>
                <span>•</span>
                <span>1 Min</span>
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 opacity-80">
               <img src={data.scents[2].image} className="w-full h-full object-contain mix-blend-soft-light" alt="decoration" />
            </div>
          </motion.div>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">Resources</h2>
          
          <div className="grid gap-4">
            {/* Resource Card 1 */}
            <Card className="border-none shadow-sm bg-white hover:bg-secondary/20 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Mind & Body Connection</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    Understanding how olfactory nerves regenerate through neuroplasticity.
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">READ</span>
                </div>
              </CardContent>
            </Card>

            {/* Resource Card 2 */}
            <Card className="border-none shadow-sm bg-white hover:bg-secondary/20 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Video size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Power of Mantra</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    Using positive affirmations to boost your recovery process.
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">WATCH</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Affirmation Footer */}
        <div className="bg-[#F9F4ED] p-6 rounded-3xl text-center">
          <p className="font-heading text-lg font-medium text-foreground italic">
            "I am healing a little more every day."
          </p>
        </div>
      </div>
    </Layout>
  );
}
