import { useEffect, useState } from "react"; 
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; 
import { AppSidebar } from "@/components/ui/app-sidebar"; 
import { AppHeader } from "@/components/ui/app-header"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button"; 
import { Paintbrush, SaveIcon } from "lucide-react";
interface Annotation { areaId: string; notes: string; }
export default function SkinAssessmentForm() { 
const [annotations, setAnnotations] = useState<Annotation[]>([]); 
const [selectedArea, setSelectedArea] = useState<string | null>(null); 
const [notes, setNotes] = useState<string>("");
useEffect(() => { const saved = localStorage.getItem("skinAssessment"); 
if (saved) { setAnnotations(JSON.parse(saved)); } }, []);
useEffect(() => { localStorage.setItem("skinAssessment", JSON.stringify(annotations)); }, [annotations]);
const handleAreaClick = (id: string) => { setSelectedArea(id); const existing = annotations.find((a) => a.areaId === id); setNotes(existing?.notes || ""); };
const handleSave = () => { if (!selectedArea) return; const updated = annotations.filter((a) => a.areaId !== selectedArea); updated.push({ areaId: selectedArea, notes }); setAnnotations(updated); setSelectedArea(null); setNotes(""); };
return ( <SidebarProvider> <div className="flex h-screen w-screen"> <AppSidebar /> <SidebarInset> <AppHeader /> <main className="flex-1 overflow-auto p-6 space-y-6"> <Card> <CardHeader> <CardTitle className="flex items-center gap-2"> <Paintbrush className="w-5 h-5" /> Skin Assessment Diagram </CardTitle> </CardHeader> <CardContent> <svg viewBox="0 0 200 400" className="w-full max-w-sm mx-auto cursor-pointer" onClick={(e) => { const target = e.target as SVGElement; if (target.tagName === "path" && target.id) { handleAreaClick(target.id); } }} > <path id="head" d="M100,10 a10,10 0 1,1 -0.1,0" fill="#eee" stroke="#333" /> <path id="torso" d="M90,30 h20 v100 h-20 z" fill="#ddd" stroke="#333" /> <path id="leftArm" d="M70,30 h10 v80 h-10 z" fill="#ddd" stroke="#333" /> <path id="rightArm" d="M120,30 h10 v80 h-10 z" fill="#ddd" stroke="#333" /> <path id="leftLeg" d="M90,130 h10 v80 h-10 z" fill="#ccc" stroke="#333" /> <path id="rightLeg" d="M100,130 h10 v80 h-10 z" fill="#ccc" stroke="#333" /> </svg> {selectedArea && ( <div className="mt-4 space-y-2"> <h4 className="font-semibold text-sm capitalize"> Notes for {selectedArea} </h4> <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe any issues or observations for this area" /> <Button onClick={handleSave} className="mt-2"> <SaveIcon className="w-4 h-4 mr-2" /> Save Note </Button> </div> )} </CardContent> </Card>

{annotations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Observations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {annotations.map((a) => (
                <div key={a.areaId} className="border rounded p-2">
                  <strong className="capitalize">{a.areaId}</strong>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {a.notes}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </SidebarInset>
  </div>
</SidebarProvider>

); }

