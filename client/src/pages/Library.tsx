import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getStoredData, saveStoredData } from "@/lib/data";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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
      <div className="p-6 pb-32 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold">My Scents</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12 shadow-md bg-primary text-white hover:bg-primary/90">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
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
                    className="rounded-xl h-12 bg-secondary/30 border-none"
                  />
                </div>
                <Button className="w-full rounded-xl h-12" onClick={handleAddScent}>Add to Library</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search your scents..." 
            className="pl-12 bg-white border-none h-12 rounded-2xl shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredScents.map((scent: any, i: number) => (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`overflow-hidden border-none shadow-none ${scent.color || 'bg-white'} h-48 relative cursor-pointer group hover:shadow-lg transition-all`}>
                <CardContent className="p-4 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                     <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold text-foreground/70">
                       {i + 1}
                     </div>
                     <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground/50 hover:bg-white/50 rounded-full">
                        <MoreHorizontal className="h-5 w-5" />
                     </Button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-heading font-bold text-xl text-foreground/90 mb-1">{scent.name}</h3>
                    <p className="text-xs text-foreground/60 line-clamp-1">{scent.description}</p>
                  </div>
                </CardContent>
                
                {/* Image Background Decoration */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-80">
                  <img src={scent.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
