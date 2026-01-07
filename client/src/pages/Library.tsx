import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_SCENTS, Scent } from "@/lib/data";
import { Search, Check, X, Sparkles, Plus, Leaf, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserCollections, createCollection, updateCollection, deleteCollection, activateCollection } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ScentCollection } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MAX_SCENTS = 4;
const BASELINE_SCENT_IDS = ['rose', 'lemon', 'eucalyptus', 'clove'];

export default function Library() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const { data: collections = [] } = useQuery({
    queryKey: ["collections", user?.id],
    queryFn: () => getUserCollections(user!.id),
    enabled: !!user,
  });

  const activeCollection = collections.find(c => c.id === activeCollectionId) || collections.find(c => c.isActive) || collections[0];
  const activeScentIds = activeCollection?.scentIds || [];

  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: (newCollection) => {
      queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
      setActiveCollectionId(newCollection.id);
      setIsCreating(false);
      setNewCollectionName("");
      toast({ title: "New collection saved", description: `${newCollection.name} is ready to customize.` });
    },
  });

  useEffect(() => {
    if (user && collections.length === 0) {
      createCollectionMutation.mutate({
        userId: user.id,
        name: "Baseline",
        context: "default",
        scentIds: BASELINE_SCENT_IDS,
        isActive: true,
      });
    }
  }, [user, collections.length]);

  const updateCollectionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ScentCollection> }) => 
      updateCollection(user!.id, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
      setActiveCollectionId(null);
      toast({ title: "Collection deleted" });
    },
  });

  const activateCollectionMutation = useMutation({
    mutationFn: ({ userId, collectionId }: { userId: string; collectionId: string }) =>
      activateCollection(userId, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", user?.id] });
      toast({ title: "Collection activated!", description: "This will be used for your training sessions." });
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
    if (!activeCollection) {
      toast({ title: "Create a collection first", description: "Add a collection to start selecting scents.", variant: "destructive" });
      return;
    }
    
    let newScentIds = [...activeScentIds];
    if (newScentIds.includes(id)) {
      newScentIds = newScentIds.filter(sid => sid !== id);
    } else {
      if (newScentIds.length >= MAX_SCENTS) {
        toast({ title: "Collection full", description: `You can select up to ${MAX_SCENTS} scents per collection.`, variant: "destructive" });
        return;
      }
      newScentIds.push(id);
    }
    updateCollectionMutation.mutate({ id: activeCollection.id, updates: { scentIds: newScentIds } });
  };

  const removeScent = (id: string) => {
    if (!activeCollection) return;
    const newScentIds = activeScentIds.filter(sid => sid !== id);
    updateCollectionMutation.mutate({ id: activeCollection.id, updates: { scentIds: newScentIds } });
  };

  const handleCreateCollection = () => {
    if (!user || !newCollectionName.trim()) return;
    createCollectionMutation.mutate({
      userId: user.id,
      name: newCollectionName.trim(),
      context: "custom",
      scentIds: [],
      isActive: false,
    });
  };

  const handleActivate = () => {
    if (!user || !activeCollection) return;
    activateCollectionMutation.mutate({ userId: user.id, collectionId: activeCollection.id });
  };

  const handleDelete = () => {
    if (!activeCollection) return;
    deleteCollectionMutation.mutate(activeCollection.id);
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
          <p className="text-white/60">Create scent collections for different occasions</p>
        </header>

        {/* Collections Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">My Collections</h2>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-[#ac41c3] hover:text-white hover:bg-[#ac41c3]/20">
                  <Plus size={16} className="mr-1" /> New
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a2e] border-[#3b1645]">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input 
                    placeholder="Collection name..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    className="bg-[#3b1645] border-transparent text-white"
                    data-testid="input-collection-name"
                  />
                  <p className="text-white/50 text-sm">You can select up to 4 scents after creating the collection.</p>
                  <Button 
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim()}
                    className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white"
                    data-testid="button-create-collection"
                  >
                    Create Collection
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Collection Pills */}
          {collections.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
              {collections.map(collection => {
                const isSelected = collection.id === (activeCollection?.id);
                return (
                  <button
                    key={collection.id}
                    onClick={() => setActiveCollectionId(collection.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all shrink-0",
                      isSelected
                        ? "bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white shadow-lg"
                        : "bg-[#3b1645] text-white/70 hover:bg-[#4a1c57]"
                    )}
                    data-testid={`button-collection-${collection.id}`}
                  >
                    <Leaf size={16} />
                    <span className="font-medium">{collection.name}</span>
                    {collection.isActive && (
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#3b1645] rounded-2xl p-6 text-center">
              <Sparkles size={32} className="text-[#ac41c3] mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">No collections yet</h3>
              <p className="text-white/60 text-sm mb-4">Create your first scent collection to get started</p>
              <Button onClick={() => setIsCreating(true)} className="bg-[#ac41c3] text-white">
                <Plus size={16} className="mr-2" /> Create Collection
              </Button>
            </div>
          )}
        </div>

        {/* Active Collection Editor */}
        {activeCollection && (
          <div className="bg-gradient-to-br from-[#3b1645] to-[#2a1033] rounded-2xl p-5 space-y-4 border border-[#ac41c3]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf size={18} className="text-[#ac41c3]" />
                <h2 className="font-bold text-white">{activeCollection.name}</h2>
                {activeCollection.isActive && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Active</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full",
                  activeScentIds.length === MAX_SCENTS 
                    ? "bg-[#ac41c3]/20 text-[#ac41c3]" 
                    : "bg-white/10 text-white/70"
                )}>
                  {activeScentIds.length}/{MAX_SCENTS}
                </span>
                <button onClick={handleDelete} className="p-2 text-white/50 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

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

            {activeScentIds.length === MAX_SCENTS && !activeCollection.isActive && (
              <Button 
                onClick={handleActivate}
                className="w-full bg-gradient-to-r from-[#6d45d2] to-[#db2faa] text-white"
              >
                <Check size={16} className="mr-2" /> Set as Active Collection
              </Button>
            )}
            
            {activeScentIds.length === MAX_SCENTS && activeCollection.isActive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-green-400 text-sm"
              >
                <Check size={16} />
                <span>This collection is used for training</span>
              </motion.div>
            )}
          </div>
        )}

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
            const isDisabled = !activeCollection || (!isActive && activeScentIds.length >= MAX_SCENTS);
            
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
