"use client";

import { useEffect, useState, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

/* -------------------- Body-annotation dots -------------------- */
interface Dot { id: string; x: number; y: number; view: "front" | "back"; }

/* -------------------- Pressure-sore checklist ----------------- */
const HOT_SPOTS = [
  "Rime of Ear",
  "Shoulder Blade",
  "Elbow",
  "Sacrum",
  "Hip",
  "Inner Knee",
  "Outer Ankle",
  "Heel",
] as const;
type HotSpot = typeof HOT_SPOTS[number];
interface HotSpotRecord { area: HotSpot; status: "Normal" | "Abnormal"; notes: string; }

/* -------------------- Component ------------------------------- */
export default function SkinAssessmentForm() {
  /* ---- Header fields ---- */
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [patientName, setPatientName] = useState("");
  const [physician, setPhysician] = useState("");
  const [room, setRoom] = useState("");

  /* ---- Pressure-sore records ---- */
  const [records, setRecords] = useState<HotSpotRecord[]>(() =>
    HOT_SPOTS.map((a) => ({ area: a, status: "Normal", notes: "" }))
  );

  /* ---- Body diagram dots ---- */
  const [dots, setDots] = useState<Dot[]>([]);
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const svgRef = useRef<SVGSVGElement>(null);

  /* ---- LocalStorage persist ---- */
  useEffect(() => {
    const saved = localStorage.getItem("skinAssessment");
    if (saved) {
      const { date, patientName, physician, room, records, dots: d, bodyView: bv } = JSON.parse(saved);
      setDate(date); setPatientName(patientName); setPhysician(physician); setRoom(room);
      setRecords(records); setDots(d || []); setBodyView(bv || "front");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("skinAssessment", JSON.stringify({ date, patientName, physician, room, records, dots, bodyView }));
  }, [date, patientName, physician, room, records, dots, bodyView]);

  const updateRecord = (area: HotSpot, patch: Partial<HotSpotRecord>) =>
    setRecords((prev) => prev.map((r) => (r.area === area ? { ...r, ...patch } : r)));

  /* ---- Diagram click logic ---- */
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDots((prev) => [...prev, { id: `${Date.now()}`, x, y, view: bodyView }]);
  };
  const removeDot = (id: string) => setDots((prev) => prev.filter((d) => d.id !== id));

  const renderFrontView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="none">
      {/* Head */}
      <path d="M100 20 C115 20 120 35 120 50 C120 70 100 80 100 80 C100 80 80 70 80 50 C80 35 85 20 100 20 Z" />
      {/* Neck */}
      <path d="M90 80 L90 90 M110 80 L110 90" />
      {/* Torso */}
      <path d="M90 90 C80 95 70 110 70 130 C70 150 80 165 90 170 L90 280 C80 285 75 295 75 305 L75 350 C80 370 90 380 100 380 C110 380 120 370 125 350 L125 305 C125 295 120 285 110 280 L110 170 C120 165 130 150 130 130 C130 110 120 95 110 90 Z" />
      {/* Chest line */}
      <path d="M75 120 C85 115 115 115 125 120" />
      {/* Navel */}
      <circle cx="100" cy="180" r="2" fill="#333" />
      {/* Left arm */}
      <path d="M70 100 C60 110 50 140 50 180 C50 220 60 250 70 260 L70 340 C65 350 60 360 60 370 L60 400 C65 410 70 415 75 410" />
      {/* Right arm */}
      <path d="M130 100 C140 110 150 140 150 180 C150 220 140 250 130 260 L130 340 C135 350 140 360 140 370 L140 400 C135 410 130 415 125 410" />
      {/* Hands */}
      <path d="M70 400 C65 405 60 410 60 420 C60 430 65 435 70 430" />
      <path d="M130 400 C135 405 140 410 140 420 C140 430 135 435 130 430" />
      {/* Legs */}
      <path d="M75 380 L75 450 C75 460 80 470 85 470 L85 480" />
      <path d="M125 380 L125 450 C125 460 120 470 115 470 L115 480" />
      {/* Feet */}
      <path d="M75 480 L80 490 L90 490 L85 480 Z" />
      <path d="M115 480 L120 490 L130 490 L125 480 Z" />
      {/* Crotch area */}
      <path d="M90 280 C95 285 105 285 110 280" />
    </g>
  );

  const renderBackView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="none">
      {/* Head (back) */}
      <path d="M100 20 C115 20 120 35 120 50 C120 70 100 80 100 80 C100 80 80 70 80 50 C80 35 85 20 100 20 Z" />
      {/* Neck (back) */}
      <path d="M90 80 L90 90 M110 80 L110 90" />
      {/* Torso (back) */}
      <path d="M90 90 C80 95 70 110 70 130 C70 150 80 165 90 170 L90 280 C80 285 75 295 75 305 L75 350 C80 370 90 380 100 380 C110 380 120 370 125 350 L125 305 C125 295 120 285 110 280 L110 170 C120 165 130 150 130 130 C130 110 120 95 110 90 Z" />
      {/* Shoulder blades */}
      <path d="M75 120 C70 125 70 135 75 140 C80 145 90 145 95 140" />
      <path d="M125 120 C130 125 130 135 125 140 C120 145 110 145 105 140" />
      {/* Buttocks area */}
      <path d="M75 280 C65 295 65 315 75 330 C85 345 115 345 125 330 C135 315 135 295 125 280" />
      {/* Left arm */}
      <path d="M70 100 C60 110 50 140 50 180 C50 220 60 250 70 260 L70 340 C65 350 60 360 60 370 L60 400 C65 410 70 415 75 410" />
      {/* Right arm */}
      <path d="M130 100 C140 110 150 140 150 180 C150 220 140 250 130 260 L130 340 C135 350 140 360 140 370 L140 400 C135 410 130 415 125 410" />
      {/* Hands */}
      <path d="M70 400 C65 405 60 410 60 420 C60 430 65 435 70 430" />
      <path d="M130 400 C135 405 140 410 140 420 C140 430 135 435 130 430" />
      {/* Legs */}
      <path d="M75 380 L75 450 C75 460 80 470 85 470 L85 480" />
      <path d="M125 380 L125 450 C125 460 120 470 115 470 L115 480" />
      {/* Feet */}
      <path d="M75 480 L80 490 L90 490 L85 480 Z" />
      <path d="M115 480 L120 490 L130 490 L125 480 Z" />
      {/* Calf lines */}
      <path d="M80 400 L80 450 M120 400 L120 450" />
    </g>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader><CardTitle>Skin Assessment Sheet</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div><Label>Patient Name</Label><Input value={patientName} onChange={(e) => setPatientName(e.target.value)} /></div>
                <div><Label>Attending Physician</Label><Input value={physician} onChange={(e) => setPhysician(e.target.value)} /></div>
                <div><Label>Room</Label><Input value={room} onChange={(e) => setRoom(e.target.value)} /></div>
              </CardContent>
            </Card>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Human Body Diagram */}
              <Card className="h-fit">
                <CardHeader><CardTitle>Body Diagram – Click/Tap to Annotate</CardTitle></CardHeader>
                <CardContent className="relative w-full max-w-sm mx-auto">
                  <div className="mb-4 flex justify-center space-x-4">
                    <Button
                      variant={bodyView === "front" ? "default" : "outline"}
                      onClick={() => setBodyView("front")}
                    >
                      Front View
                    </Button>
                    <Button
                      variant={bodyView === "back" ? "default" : "outline"}
                      onClick={() => setBodyView("back")}
                    >
                      Back View
                    </Button>
                  </div>
                  <svg
                    ref={svgRef}
                    viewBox="0 0 200 500"
                    className="w-full h-auto cursor-crosshair border"
                    onClick={handleSvgClick}
                  >
                    {bodyView === "front" ? renderFrontView() : renderBackView()}

                    {/* Annotation dots */}
                    {dots.filter(dot => dot.view === bodyView).map((dot) => (
                      <g key={dot.id}>
                        <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="4" fill="red" />
                        <circle cx={`${dot.x}%`} cy={`${dot.y}%`} r="10" fill="transparent" onClick={(e) => { e.stopPropagation(); removeDot(dot.id); }} className="cursor-pointer" />
                      </g>
                    ))}
                  </svg>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Tap anywhere to add a red dot; tap the dot to remove.</p>
                </CardContent>
              </Card>

              {/* RIGHT: Pressure-sore checklist */}
              <Card>
                <CardHeader><CardTitle>Areas Most Prone to Pressure Sores</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {records.map(({ area, status, notes }) => (
                    <div key={area} className="border rounded p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{area}</span>
                        <RadioGroup value={status} onValueChange={(val: "Normal" | "Abnormal") => updateRecord(area, { status: val })} className="flex gap-4">
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
  );
}
