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
    <g stroke="#333" strokeWidth="1.5" fill="#f7f7f7">
      {/* Head */}
      <ellipse cx="100" cy="45" rx="35" ry="40" />
      {/* Neck */}
      <rect x="85" y="80" width="30" height="20" rx="10" />
      {/* Torso */}
      <path d="M65 100 L65 190 C65 210 75 230 100 230 C125 230 135 210 135 190 L135 100 Z" />
      {/* Left arm */}
      <path d="M65 110 C45 120 25 140 25 190 C25 240 45 260 65 270" />
      {/* Right arm */}
      <path d="M135 110 C155 120 175 140 175 190 C175 240 155 260 135 270" />
      {/* Left leg */}
      <path d="M75 230 C70 270 70 390 75 490" />
      {/* Right leg */}
      <path d="M125 230 C130 270 130 390 125 490" />
    </g>
  );

  const renderBackView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="#f7f7f7">
      {/* Head (back) */}
      <ellipse cx="100" cy="45" rx="35" ry="40" />
      {/* Neck (back) */}
      <rect x="85" y="80" width="30" height="20" rx="10" />
      {/* Torso (back) - Simplified for example */}
      <path d="M65 100 L65 190 C65 210 75 230 100 230 C125 230 135 210 135 190 L135 100 Z" />
      {/* Shoulders - more pronounced from back */}
      <path d="M65 100 C50 110 40 125 45 140 M135 100 C150 110 160 125 155 140" />
      {/* Buttocks area */}
      <path d="M75 230 C65 250 65 270 75 290 C85 310 115 310 125 290 C135 270 135 250 125 230" />
      {/* Arms and Legs (similar but from back perspective) */}
      <path d="M65 110 C45 120 25 140 25 190 C25 240 45 260 65 270" />
      <path d="M135 110 C155 120 175 140 175 190 C175 240 155 260 135 270" />
      <path d="M75 230 C70 270 70 390 75 490" />
      <path d="M125 230 C130 270 130 390 125 490" />
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
