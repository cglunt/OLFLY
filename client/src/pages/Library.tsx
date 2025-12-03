import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { getStoredData, saveStoredData } from "@/lib/data";
import { Plus, Search, MoreHorizontal } from "lucide-react";

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
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=300&h=300", // Placeholder
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
          <h1 className="text-3xl font-bold">Library</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-10 w-10 shadow-md">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Scent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scent Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Coffee, Cinnamon..." 
                    value={newScentName}
                    onChange={(e) => setNewScentName(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddScent}>Add to Library</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your scents..." 
            className="pl-10 bg-secondary/50 border-none h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredScents.map((scent: any) => (
            <Card key={scent.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
              <div className="relative aspect-square">
                <img 
                  src={scent.image} 
                  alt={scent.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <h3 className="font-bold text-lg leading-none">{scent.name}</h3>
                </div>
                <Button size="icon" variant="ghost" className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-3 bg-card">
                <p className="text-xs text-muted-foreground line-clamp-2">{scent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
