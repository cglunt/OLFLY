import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getStoredData, saveStoredData } from "@/lib/data";
import { Plus, Search, MoreVertical, Star } from "lucide-react";
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
        <div className="space-y-4">
          {filteredScents.map((scent: any, i: number) => (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-none bg-secondary hover:bg-white/5 transition-colors cursor-pointer rounded-[1.5rem] group">
                <CardContent className="p-4 flex items-center gap-5">
                   {/* Flat Block Icon Style */}
                   <div className={`h-16 w-16 rounded-2xl ${scent.color || 'bg-primary'} flex items-center justify-center shrink-0 shadow-lg`}>
                      <span className="text-2xl font-bold text-black/80">{scent.name[0]}</span>
                   </div>
                   
                   <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-bold text-lg text-white truncate mb-1">{scent.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{scent.description}</p>
                   </div>

                   <div className="flex items-center gap-1">
                      {scent.isDefault && (
                         <div className="p-2 rounded-full bg-white/5 text-primary">
                            <Star size={18} fill="currentColor" />
                         </div>
                      )}
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
