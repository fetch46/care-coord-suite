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
    // Adjusting coordinates to match the aspect ratio of the new SVG paths (viewBox="0 0 400 900")
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 900; // Using 900 as the max Y for viewBox
    setDots((prev) => [...prev, { id: `${Date.now()}`, x, y, view: bodyView }]);
  };
  const removeDot = (id: string) => setDots((prev) => prev.filter((d) => d.id !== id));

  const renderFrontView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="none">
      {/* Head */}
      <path d="M200,60 C230,60 240,80 240,100 C240,130 220,150 200,150 C180,150 160,130 160,100 C160,80 170,60 200,60 Z" />
      {/* Neck */}
      <path d="M185,150 L185,170 M215,150 L215,170" />
      {/* Torso */}
      <path d="M185,170 C160,180 140,210 140,250 C140,300 160,340 185,350 L185,550 C170,560 165,580 165,600 C165,620 170,640 185,650 L185,730 C185,750 190,760 200,760 C210,760 215,750 215,730 L215,650 C230,640 235,620 235,600 C235,580 230,560 215,550 L215,350 C240,340 260,300 260,250 C260,210 240,180 215,170 Z" />
      {/* Chest lines */}
      <path d="M150,230 C165,220 235,220 250,230" />
      {/* Navel */}
      <circle cx="200" cy="380" r="4" fill="#333" />
      {/* Abdominal muscle lines */}
      <path d="M190,320 V440 M210,320 V440" />
      <path d="M185,340 H215 M185,380 H215 M185,420 H215" />
      {/* Inner thigh/groin */}
      <path d="M195,550 C198,560 202,560 205,550" />
      {/* Arms */}
      <path d="M140,200 C120,220 100,280 100,350 C100,420 120,480 140,500 L140,650 C130,670 120,700 120,720 L120,780 C130,800 140,810 150,800" />
      <path d="M260,200 C280,220 300,280 300,350 C300,420 280,480 260,500 L260,650 C270,670 280,700 280,720 L280,780 C270,800 260,810 250,800" />
      {/* Hands */}
      <path d="M120,780 C110,790 100,800 100,820 C100,840 110,850 120,840" />
      <path d="M280,780 C290,790 300,800 300,820 C300,840 290,850 280,840" />
      {/* Legs */}
      <path d="M185,760 L185,830 C185,840 190,850 195,850 L195,870 C195,880 190,890 185,890 L175,890 C165,890 155,880 155,870 L155,850 C155,840 160,830 165,830" />
      <path d="M215,760 L215,830 C215,840 210,850 205,850 L205,870 C205,880 210,890 215,890 L225,890 C235,890 245,880 245,870 L245,850 C245,840 240,830 235,830" />
      {/* Feet */}
      <path d="M175,890 L180,900 L200,900 L195,890 Z" />
      <path d="M225,890 L220,900 L200,900 L205,890 Z" />
      {/* Toes */}
      <path d="M180,900 L180,910 M190,900 L190,910" />
      <path d="M220,900 L220,910 M210,900 L210,910" />
    </g>
  );

  const renderBackView = () => (
    <g stroke="#333" strokeWidth="1.5" fill="none">
      {/* Head (back) */}
      <path d="M200,60 C230,60 240,80 240,100 C240,130 220,150 200,150 C180,150 160,130 160,100 C160,80 170,60 200,60 Z" />
      {/* Neck (back) */}
      <path d="M185,150 L185,170 M215,150 L215,170" />
      {/* Torso (back) */}
      <path d="M185,170 C160,180 140,210 140,250 C140,300 160,340 185,350 L185,550 C170,560 165,580 165,600 C165,620 170,640 185,650 L185,730 C185,750 190,760 200,760 C210,760 215,750 215,730 L215,650 C230,640 235,620 235,600 C235,580 230,560 215,550 L215,350 C240,340 260,300 260,250 C260,210 240,180 215,170 Z" />
      {/* Shoulder blades */}
      <path d="M165,220 C160,230 160,250 165,260 C170,270 185,270 190,260" />
      <path d="M235,220 C240,230 240,250 235,260 C230,270 215,270 210,260" />
      {/* Spinal column line */}
      <path d="M200,170 V550" />
      {/* Buttocks area */}
      <path d="M165,550 C155,570 155,600 165,620 C175,640 225,640 235,620 C245,600 245,570 235,550" />
      {/* Arms */}
      <path d="M140,200 C120,220 100,280 100,350 C100,420 120,480 140,500 L140,650 C130,670 120,700 120,720 L120,780 C130,800 140,810 150,800" />
      <path d="M260,200 C280,220 300,280 300,350 C300,420 280,480 260,500 L260,650 C270,670 280,700 280,720 L280,780 C270,800 260,810 250,800" />
      {/* Hands */}
      <path d="M120,780 C110,790 100,800 100,820 C100,840 110,850 120,840" />
      <path d="M280,780 C290,790 300,800 300,820 C300,840 290,850 280,840" />
      {/* Legs */}
      <path d="M185,760 L185,830 C185,840 190,850 195,850 L195,870 C195,880 190,890 185,890 L175,890 C165,890 155,880 155,870 L155,850 C155,840 160,830 165,830" />
      <path d="M215,760 L215,830 C215,840 210,850 205,850 L205,870 C205,880 210,890 215,890 L225,890 C235,890 245,880 245,870 L245,850 C245,840 240,830 235,830" />
      {/* Calf muscles */}
      <path d="M175,820 C178,830 178,840 175,850" />
      <path d="M225,820 C222,830 222,840 225,850" />
      {/* Feet */}
      <path d="M175,890 L180,900 L200,900 L195,890 Z" />
      <path d="M225,890 L220,900 L200,900 L205,890 Z" />
      {/* Toes */}
      <path d="M180,900 L180,910 M190,900 L190,910" />
      <path d="M220,900 L220,910 M210,900 L210,910" />
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
                  {/* Adjusted viewBox for more vertical space and accurate tracing */}
                  <svg
                    ref={svgRef}
                    viewBox="0 0 400 920" // Adjusted viewBox to accommodate the full height and width of the new tracing
                    className="w-full h-auto cursor-crosshair border"
                    onClick={handleSvgClick}
                  >
                    {bodyView === "front" ? renderFrontView() : renderBackView()}

                    {/* Annotation dots */}
                    {dots.filter(dot => dot.view === bodyView).map((dot) => (
                      <g key={dot.id}>
                        {/* Dots coordinates are absolute now, not percentages */}
                        <circle cx={dot.x} cy={dot.y} r="4" fill="red" />
                        <circle cx={dot.x} cy={dot.y} r="10" fill="transparent" onClick={(e) => { e.stopPropagation(); removeDot(dot.id); }} className="cursor-pointer" />
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
