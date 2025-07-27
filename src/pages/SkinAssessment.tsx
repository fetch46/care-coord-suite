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
    <g stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <path d="M100 20 C115 20 125 35 125 50 C125 70 110 80 100 80 C90 80 75 70 75 50 C75 35 85 20 100 20 Z" />
      {/* Neck */}
      <path d="M90 80 L90 95 M110 80 L110 95" />
      {/* Torso (Main Outline) */}
      <path d="M90 95 C85 90 75 95 70 105 C65 115 65 130 70 145 C75 160 85 170 90 175 L90 280 C85 285 80 295 80 305 L80 350 C80 370 90 380 100 380 C110 380 120 370 120 350 L120 305 C120 295 115 285 110 280 L110 175 C115 170 125 160 130 145 C135 130 135 115 130 105 C125 95 115 90 110 95 Z" />
      {/* Chest line */}
      <path d="M75 120 C85 115 115 115 125 120" />
      {/* Navel */}
      <circle cx="100" cy="190" r="2" fill="#333" />
      {/* Abdominal muscle lines */}
      <path d="M95 160 V220 M105 160 V220" />
      <path d="M90 220 H110" />
      {/* Arms (Outline) */}
      <path d="M70 110 C60 115 50 130 50 160 C50 200 60 230 70 240 L70 340 C65 350 60 365 60 380 L60 410 C65 420 70 425 75 420" />
      <path d="M130 110 C140 115 150 130 150 160 C150 200 140 230 130 240 L130 340 C135 350 140 365 140 380 L140 410 C135 420 130 425 125 420" />
      {/* Forearm lines */}
      <path d="M65 290 L65 330 M135 290 L135 330" />
      {/* Hands (simplified outlines) */}
      <path d="M70 410 C65 415 60 420 60 430 C60 440 65 445 70 440" />
      <path d="M130 410 C135 415 140 420 140 430 C140 440 135 445 130 440" />
      {/* Legs (Outline) */}
      <path d="M80 380 L80 440 C80 450 85 460 90 460 L90 470 C90 475 85 480 80 480 L75 480 C70 480 65 475 65 470 L65 450 C65 440 70 430 75 430" />
      <path d="M120 380 L120 440 C120 450 115 460 110 460 L110 470 C110 475 115 480 120 480 L125 480 C130 480 135 475 135 470 L135 450 C135 440 130 430 125 430" />
      {/* Inner thigh line */}
      <path d="M98 380 L92 410" />
      {/* Kneecaps (simple curves) */}
      <path d="M85 435 C88 438 92 438 95 435" />
      <path d="M105 435 C108 438 112 438 115 435" />
      {/* Feet (Outline) */}
      <path d="M75 480 L80 490 L90 490 L85 480 Z" />
      <path d="M115 480 L120 490 L130 490 L125 480 Z" />
      {/* Toes (simple lines) */}
      <path d="M80 490 L80 495 M85 490 L85 495" />
      <path d="M120 490 L120 495 M125 490 L125 495" />
    </g>
  );

  const renderBackView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head (back) */}
      <path d="M100 20 C115 20 125 35 125 50 C125 70 110 80 100 80 C90 80 75 70 75 50 C75 35 85 20 100 20 Z" />
      {/* Neck (back) */}
      <path d="M90 80 L90 95 M110 80 L110 95" />
      {/* Torso (Main Outline, back) */}
      <path d="M90 95 C85 90 75 95 70 105 C65 115 65 130 70 145 C75 160 85 170 90 175 L90 280 C85 285 80 295 80 305 L80 350 C80 370 90 380 100 380 C110 380 120 370 120 350 L120 305 C120 295 115 285 110 280 L110 175 C115 170 125 160 130 145 C135 130 135 115 130 105 C125 95 115 90 110 95 Z" />
      {/* Shoulder blades */}
      <path d="M78 120 C75 125 75 135 78 140 C81 145 90 145 95 140" />
      <path d="M122 120 C125 125 125 135 122 140 C119 145 110 145 105 140" />
      {/* Spinal column line */}
      <path d="M100 95 V280" />
      {/* Buttocks area */}
      <path d="M80 280 C70 295 70 315 80 330 C90 345 110 345 120 330 C130 315 130 295 120 280" />
      {/* Arms (Outline) */}
      <path d="M70 110 C60 115 50 130 50 160 C50 200 60 230 70 240 L70 340 C65 350 60 365 60 380 L60 410 C65 420 70 425 75 420" />
      <path d="M130 110 C140 115 150 130 150 160 C150 200 140 230 130 240 L130 340 C135 350 140 365 140 380 L140 410 C135 420 130 425 125 420" />
      {/* Forearm lines */}
      <path d="M65 290 L65 330 M135 290 L135 330" />
      {/* Hands (simplified outlines) */}
      <path d="M70 410 C65 415 60 420 60 430 C60 440 65 445 70 440" />
      <path d="M130 410 C135 415 140 420 140 430 C140 440 135 445 130 440" />
      {/* Legs (Outline) */}
      <path d="M80 380 L80 440 C80 450 85 460 90 460 L90 470 C90 475 85 480 80 480 L75 480 C70 480 65 475 65 470 L65 450 C65 440 70 430 75 430" />
      <path d="M120 380 L120 440 C120 450 115 460 110 460 L110 470 C110 475 115 480 120 480 L125 480 C130 480 135 475 135 470 L135 450 C135 440 130 430 125 430" />
      {/* Calf muscles */}
      <path d="M85 410 C88 420 88 430 85 440" />
      <path d="M115 410 C112 420 112 430 115 440" />
      {/* Feet (Outline) */}
      <path d="M75 480 L80 490 L90 490 L85 480 Z" />
      <path d="M115 480 L120 490 L130 490 L125 480 Z" />
      {/* Toes (simple lines) */}
      <path d="M80 490 L80 495 M85 490 L85 495" />
      <path d="M120 490 L120 495 M125 490 L125 495" />
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
