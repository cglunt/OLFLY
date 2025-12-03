import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredData, saveStoredData, ALL_SCENTS, Scent, ScentCategory } from "@/lib/data";
import { Search, Play, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Library() {
  const [data, setData] = useState(getStoredData());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const activeScentIds = data.activeScentIds || ['clove', 'lemon', 'eucalyptus', 'rose'];

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(ALL_SCENTS.map(s => s.category)))];

  const filteredScents = ALL_SCENTS.filter((s: Scent) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleScentActive = (id: string) => {
      let newActiveIds = [...activeScentIds];
      if (newActiveIds.includes(id)) {
          newActiveIds = newActiveIds.filter(sid => sid !== id);
      } else {
          newActiveIds.push(id);
      }
      
      const newData = { ...data, activeScentIds: newActiveIds };
      saveStoredData(newData);
      setData(newData);
  };

  return (
    <Layout>
      <div className="p-6 pb-32 space-y-6">
        <header className="pt-2 space-y-4">
          <h1 className="text-3xl font-heading font-bold text-white">Library</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search scents..." 
                className="pl-12 bg-secondary border-transparent focus:border-primary h-14 rounded-[1.25rem] text-white placeholder:text-muted-foreground shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                        selectedCategory === cat 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-secondary text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                >
                    {cat}
                </button>
            ))}
          </div>
        </header>

        {/* Scents List */}
        <div className="space-y-3">
          {filteredScents.map((scent, i) => {
            const isActive = activeScentIds.includes(scent.id);
            
            return (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div 
                onClick={() => toggleScentActive(scent.id)}
                className={cn(
                    "rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer transition-all border",
                    isActive 
                        ? "bg-gradient-to-br from-secondary to-secondary/50 border-primary/30" 
                        : "bg-secondary/50 border-transparent hover:bg-secondary"
                )}
              >
                {/* Gradient Circle with Icon */}
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md shrink-0",
                    scent.color
                )}>
                   <span className="font-bold text-lg">{scent.name[0]}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-white text-lg truncate">{scent.name}</h3>
                   <p className="text-xs text-muted-foreground truncate">{scent.description}</p>
                </div>

                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors border",
                    isActive ? "bg-primary border-primary text-white" : "bg-transparent border-white/10 text-transparent"
                )}>
                   <Check size={14} strokeWidth={4} />
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </Layout>
  );
}
