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
      <div className="p-6 pb-32 space-y-8">
        <header className="pt-2 space-y-4">
          <h1 className="text-3xl font-heading font-bold text-white">Library</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-[#B9AEE2]" />
            <Input 
                placeholder="Search scents..." 
                className="pl-12 bg-[#2B215B] border-transparent focus:border-[#DF37FF] h-14 rounded-2xl text-white placeholder:text-[#B9AEE2] shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors",
                        selectedCategory === cat 
                            ? "bg-[#DF37FF] text-white shadow-md" 
                            : "bg-[#2B215B] text-[#B9AEE2] hover:bg-[#322766] hover:text-white"
                    )}
                >
                    {cat}
                </button>
            ))}
          </div>
        </header>

        {/* Scents List */}
        <div className="space-y-4">
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
                    "rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all shadow-md",
                    isActive 
                        ? "bg-[#2B215B] border border-[#DF37FF]/50" 
                        : "bg-[#2B215B] border border-transparent hover:bg-[#322766]"
                )}
              >
                {/* Gradient Circle with Icon */}
                <div className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center text-white shadow-sm shrink-0",
                    isActive ? "bg-gradient-to-br from-[#DF37FF] to-[#A259FF]" : "bg-[#231A4A] text-[#B9AEE2]"
                )}>
                   <span className="font-bold text-lg">{scent.name[0]}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-white text-lg truncate">{scent.name}</h3>
                   <p className="text-sm text-[#B9AEE2] truncate">{scent.description}</p>
                </div>

                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors border",
                    isActive ? "bg-[#DF37FF] border-[#DF37FF] text-white" : "bg-transparent border-[#B9AEE2] text-transparent"
                )}>
                   <Check size={16} strokeWidth={4} />
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </Layout>
  );
}
