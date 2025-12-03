import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getStoredData, saveStoredData } from "@/lib/data";
import { Plus, Search, MoreVertical, Star, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Library() {
  const [data, setData] = useState(getStoredData());
  const [searchTerm, setSearchTerm] = useState("");
  const [newScentName, setNewScentName] = useState("");

  const filteredScents = data.scents.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddScent = () => {
    if (!newScentName) return;
    
    const newScent = {
      id: `custom-${Date.now()}`,
      name: newScentName,
      description: "Custom scent added to library",
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=300&h=300", 
      color: "bg-gray-100",
      isDefault: false
    };

    const newData = {
      ...data,
      scents: [...data.scents, newScent]
    };
    
    saveStoredData(newData);
    setData(newData);
    setNewScentName("");
  };

  // Map of gradient colors for scents to match the "Top Routines" style
  const getGradient = (color: string) => {
    if (color.includes('orange')) return 'bg-gradient-to-br from-orange-400 to-red-500';
    if (color.includes('yellow')) return 'bg-gradient-to-br from-yellow-300 to-orange-500';
    if (color.includes('teal')) return 'bg-gradient-to-br from-teal-400 to-emerald-600';
    if (color.includes('pink')) return 'bg-gradient-to-br from-pink-400 to-rose-600';
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  };

  return (
    <Layout>
      <div className="p-6 pb-32 space-y-8">
        <header className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-heading font-bold text-white">My Collection</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12 shadow-lg shadow-primary/30 bg-primary text-white hover:bg-primary/90">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl bg-secondary border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">Add New Scent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scent Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Coffee, Cinnamon..." 
                    value={newScentName}
                    onChange={(e) => setNewScentName(e.target.value)}
                    className="rounded-xl h-12 bg-black/20 border-white/10 text-white"
                  />
                </div>
                <Button className="w-full rounded-xl h-12 bg-primary text-white hover:bg-primary/90" onClick={handleAddScent}>Add to Library</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

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

        {/* Scents List */}
        <div className="space-y-3">
          {filteredScents.map((scent: any, i: number) => (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="bg-secondary rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors">
                {/* Gradient Circle with Play Icon - matching "Top Routines" style */}
                <div className={`h-12 w-12 rounded-full ${getGradient(scent.color || 'bg-primary')} flex items-center justify-center text-white shadow-md shadow-black/20 shrink-0`}>
                   <Play size={20} fill="currentColor" className="ml-1" />
                </div>
                
                <div className="flex-1 min-w-0">
                   <h3 className="font-bold text-white text-lg truncate">{scent.name}</h3>
                   <p className="text-xs text-muted-foreground truncate">{scent.description}</p>
                </div>

                <div className="flex items-center gap-2">
                   {scent.isDefault && (
                       <Star size={16} className="text-primary/40" fill="currentColor" />
                   )}
                   <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                      <MoreVertical size={18} />
                   </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
