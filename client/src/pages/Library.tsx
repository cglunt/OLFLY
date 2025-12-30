import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_SCENTS, Scent } from "@/lib/data";
import { Search, Check, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserScents, setUserScents } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const MAX_SCENTS = 4;

export default function Library() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: userScents = [] } = useQuery({
    queryKey: ["userScents", user?.id],
    queryFn: () => getUserScents(user!.id),
    enabled: !!user,
  });

  const activeScentIds = userScents.map(s => s.scentId);

  const updateScentsMutation = useMutation({
    mutationFn: (scentIds: string[]) => setUserScents(user!.id, scentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userScents", user?.id] });
    },
  });

  const categories = ["All", ...Array.from(new Set(ALL_SCENTS.map(s => s.category)))];

  const filteredScents = ALL_SCENTS.filter((s: Scent) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedScents = ALL_SCENTS.filter(s => activeScentIds.includes(s.id));

  const toggleScentActive = (id: string) => {
    let newActiveIds = [...activeScentIds];
    if (newActiveIds.includes(id)) {
      newActiveIds = newActiveIds.filter(sid => sid !== id);
      updateScentsMutation.mutate(newActiveIds);
    } else {
      if (newActiveIds.length >= MAX_SCENTS) {
        toast({
          title: "Collection full",
          description: `You can select up to ${MAX_SCENTS} scents for your session.`,
          variant: "destructive",
        });
        return;
      }
      newActiveIds.push(id);
      updateScentsMutation.mutate(newActiveIds);
    }
  };

  const removeScent = (id: string) => {
    const newActiveIds = activeScentIds.filter(sid => sid !== id);
    updateScentsMutation.mutate(newActiveIds);
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <p className="text-white/70">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 pb-32 space-y-6">
        <header className="pt-2 space-y-1">
          <h1 className="text-3xl font-heading font-bold text-white">Library</h1>
          <p className="text-white/60">Build your scent collection for training</p>
        </header>

        {/* My Session Collection */}
        <div className="bg-gradient-to-br from-[#3b1645] to-[#2a1033] rounded-2xl p-5 space-y-4 border border-[#ac41c3]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#ac41c3]" />
              <h2 className="font-bold text-white">My Session Collection</h2>
            </div>
            <span className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              activeScentIds.length === MAX_SCENTS 
                ? "bg-[#ac41c3]/20 text-[#ac41c3]" 
                : "bg-white/10 text-white/70"
            )}>
              {activeScentIds.length} of {MAX_SCENTS}
            </span>
          </div>
          
          <p className="text-white/60 text-sm">
            Choose {MAX_SCENTS} scents for your guided sessions
          </p>

          {/* Selected Scents Chips */}
          <div className="flex flex-wrap gap-2 min-h-[44px]">
            <AnimatePresence mode="popLayout">
              {selectedScents.length > 0 ? (
                selectedScents.map(scent => (
                  <motion.div
                    key={scent.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="flex items-center gap-2 bg-[#ac41c3]/30 text-white px-3 py-2 rounded-full border border-[#ac41c3]/50"
                  >
                    <span className="text-sm font-medium">{scent.name}</span>
                    <button 
                      onClick={() => removeScent(scent.id)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      data-testid={`button-remove-${scent.id}`}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/40 text-sm italic"
                >
                  Tap scents below to add them
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {activeScentIds.length === MAX_SCENTS && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[#ac41c3] text-sm"
            >
              <Check size={16} />
              <span>Collection ready for training!</span>
            </motion.div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-white/70" />
            <Input 
                placeholder="Search scents..." 
                className="pl-12 bg-[#3b1645] border-transparent focus:border-[#ac41c3] h-14 rounded-2xl text-white placeholder:text-white/50 shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-scents"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors",
                        selectedCategory === cat 
                            ? "bg-[#ac41c3] text-white shadow-md" 
                            : "bg-[#3b1645] text-white/70 hover:bg-[#4a1c57] hover:text-white"
                    )}
                    data-testid={`button-category-${cat.toLowerCase()}`}
                >
                    {cat}
                </button>
            ))}
          </div>
        </div>

        {/* All Scents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">All Scents</h3>
          
          {filteredScents.map((scent, i) => {
            const isActive = activeScentIds.includes(scent.id);
            const isDisabled = !isActive && activeScentIds.length >= MAX_SCENTS;
            
            return (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div 
                onClick={() => !isDisabled && toggleScentActive(scent.id)}
                className={cn(
                    "rounded-2xl p-5 flex items-center gap-5 transition-all shadow-md",
                    isDisabled 
                        ? "bg-[#2a1033] opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                    isActive 
                        ? "bg-[#3b1645] border-2 border-[#ac41c3] shadow-[#ac41c3]/20 shadow-lg" 
                        : !isDisabled && "bg-[#3b1645] border border-transparent hover:bg-[#4a1c57]"
                )}
                data-testid={`card-scent-${scent.id}`}
              >
                <div className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 overflow-hidden",
                    isActive ? "ring-2 ring-[#ac41c3] ring-offset-2 ring-offset-[#0c0c1d]" : ""
                )}>
                   {scent.image ? (
                     <img src={scent.image} alt={scent.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className={cn("w-full h-full flex items-center justify-center", scent.color)}>
                       <span className="font-bold text-lg">{scent.name[0]}</span>
                     </div>
                   )}
                </div>
                
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-white text-lg truncate" data-testid={`text-scent-name-${scent.id}`}>{scent.name}</h3>
                   <p className="text-sm text-white/70 truncate">{scent.description}</p>
                </div>

                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all border-2",
                    isActive 
                      ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa] border-transparent text-white shadow-md" 
                      : "bg-transparent border-white/30 text-transparent"
                )}
                data-testid={`icon-check-${scent.id}`}
                >
                   <Check size={16} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </Layout>
  );
}
