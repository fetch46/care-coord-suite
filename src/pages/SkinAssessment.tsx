// File: SkinAssessmentForm.tsx

"use client";

import { useEffect, useState, useRef } from "react"; import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; import { AppSidebar } from "@/components/ui/app-sidebar"; import { AppHeader } from "@/components/ui/app-header"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Input } from "@/components/ui/input"; import { Label } from "@/components/ui/label"; import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; import { Textarea } from "@/components/ui/textarea"; import { Button } from "@/components/ui/button"; import { Printer } from "lucide-react";

/* -------------------- Body-annotation dots -------------------- */ interface Dot { id: string; x: number; y: number; view: "front" | "back"; }

/* -------------------- Pressure-sore checklist ----------------- */ const HOT_SPOTS = [ "Rime of Ear", "Shoulder Blade", "Elbow", "Sacrum", "Hip", "Inner Knee", "Outer Ankle", "Heel" ] as const; type HotSpot = typeof HOT_SPOTS[number]; interface HotSpotRecord { area: HotSpot; status: "Normal" | "Abnormal"; notes: string; }

export default function SkinAssessmentForm() { const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [patientName, setPatientName] = useState(""); const [physician, setPhysician] = useState(""); const [room, setRoom] = useState(""); const [records, setRecords] = useState<HotSpotRecord[]>( HOT_SPOTS.map((a) => ({ area: a, status: "Normal", notes: "" })) ); const [dots, setDots] = useState<Dot[]>([]); const [bodyView, setBodyView] = useState<"front" | "back">("front"); const svgRef = useRef<SVGSVGElement>(null);

useEffect(() => { const saved = localStorage.getItem("skinAssessment"); if (saved) { const parsed = JSON.parse(saved); setDate(parsed.date); setPatientName(parsed.patientName); setPhysician(parsed.physician); setRoom(parsed.room); setRecords(parsed.records); setDots(parsed.dots || []); setBodyView(parsed.bodyView || "front"); } }, []); useEffect(() => { localStorage.setItem( "skinAssessment", JSON.stringify({ date, patientName, physician, room, records, dots, bodyView }) ); }, [date, patientName, physician, room, records, dots, bodyView]);

const updateRecord = (area: HotSpot, patch: Partial<HotSpotRecord>) => { setRecords((prev) => prev.map((r) => (r.area === area ? { ...r, ...patch } : r))); };

const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => { if (!svgRef.current) return; const rect = svgRef.current.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width) * 400; const y = ((e.clientY - rect.top) / rect.height) * 900; setDots((prev) => [...prev, { id: ${Date.now()}, x, y, view: bodyView }]); }; const removeDot = (id: string) => setDots((prev) => prev.filter((d) => d.id !== id));

const renderAnatomicallyAccurateFront = () => ( <g stroke="#333" strokeWidth="1.5" fill="none"> <path d="M200,70 a40,50 0 1,0 0.1,0" fill="#eee" /> <path d="M180,120 Q200,140 220,120 Q230,150 220,180 Q230,200 230,250 Q230,320 200,320 Q170,320 170,250 Q170,200 180,180 Q170,150 180,120 Z" fill="#eee" /> <path d="M170,320 L170,600 Q170,640 200,640 Q230,640 230,600 L230,320" fill="#eee" /> <path d="M170,600 L170,700 Q170,740 200,740 Q230,740 230,700 L230,600" fill="#eee" /> <path d="M170,700 L160,880 Q190,880 200,860 Q210,880 240,880 L230,700" fill="#eee" /> </g> );

const renderAnatomicallyAccurateBack = () => ( <g stroke="#333" strokeWidth="1.5" fill="none"> <path d="M200,70 a40,50 0 1,0 0.1,0" fill="#eee" /> <path d="M180,120 Q200,140 220,120 Q230,150 220,180 Q230,200 230,250 Q230,320 200,320 Q170,320 170,250 Q170,200 180,180 Q170,150 180,120 Z" fill="#eee" /> <path d="M170,320 L170,600 Q170,640 200,640 Q230,640 230,600 L230,320" fill="#eee" /> <path d="M170,600 L170,700 Q170,740 200,740 Q230,740 230,700 L230,600" fill="#eee" /> <path d="M170,700 L160,880 Q190,880 200,860 Q210,880 240,880 L230,700" fill="#eee" /> <line x1="200" y1="150" x2="200" y2="640" stroke="#000" strokeWidth="1" /> </g> );

return ( <SidebarProvider> <div className="flex h-screen w-screen"> <AppSidebar /> <SidebarInset> <AppHeader /> <main className="flex-1 overflow-auto p-6 space-y-6"> <Card> <CardHeader><CardTitle>Skin Assessment Sheet</CardTitle></CardHeader> <CardContent className="grid md:grid-cols-2 gap-4"> <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div> <div><Label>Patient Name</Label><Input value={patientName} onChange={(e) => setPatientName(e.target.value)} /></div> <div><Label>Attending Physician</Label><Input value={physician} onChange={(e) => setPhysician(e.target.value)} /></div> <div><Label>Room</Label><Input value={room} onChange={(e) => setRoom(e.target.value)} /></div> </CardContent> </Card>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-fit">
            <CardHeader><CardTitle>Body Diagram – Click/Tap to Annotate</CardTitle></CardHeader>
            <CardContent className="relative w-full max-w-sm mx-auto">
              <div className="mb-4 flex justify-center space-x-4">
                <Button variant={bodyView === "front" ? "default" : "outline"} onClick={() => setBodyView("front")}>Front View</Button>
                <Button variant={bodyView === "back" ? "default" : "outline"} onClick={() => setBodyView("back")}>Back View</Button>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 400 920"
                className="w-full h-auto cursor-crosshair border"
                onClick={handleSvgClick}
              >
                {bodyView === "front" ? renderAnatomicallyAccurateFront() : renderAnatomicallyAccurateBack()}
                {dots.filter(dot => dot.view === bodyView).map((dot) => (
                  <g key={dot.id}>
                    <circle cx={dot.x} cy={dot.y} r="4" fill="red" />
                    <circle cx={dot.x} cy={dot.y} r="10" fill="transparent" onClick={(e) => { e.stopPropagation(); removeDot(dot.id); }} className="cursor-pointer" />
                  </g>
                ))}
              </svg>
              <p className="text-xs text-muted-foreground mt-2 text-center">Tap anywhere to add a red dot; tap the dot to remove.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Areas Most Prone to Pressure Sores</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {records.map(({ area, status, notes }) => (
                <div key={area} className="border rounded p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{area}</span>
                    <RadioGroup value={status} onValueChange={(val) => updateRecord(area, { status: val })} className="flex gap-4">
                      <div className="flex items-center gap-2"><RadioGroupItem value="Normal" id={`${area}-normal`} /><Label htmlFor={`${area}-normal`}>Normal</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="Abnormal" id={`${area}-abnormal`} /><Label htmlFor={`${area}-abnormal`}>Abnormal</Label></div>
                    </RadioGroup>
                  </div>
                  {status === "Abnormal" && (
                    <Textarea value={notes} onChange={(e) => updateRecord(area, { notes: e.target.value })} placeholder="Describe any broken, bruised or reddened areas" rows={2} />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Button onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print / Export</Button>
      </main>
    </SidebarInset>
  </div>
</SidebarProvider>

); }

