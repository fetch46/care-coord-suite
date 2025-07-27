"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 920; // Adjusted height for the new outlines

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

  // --- Canvas Drawing Logic ---
  const drawBody = useCallback((ctx: CanvasRenderingContext2D, view: "front" | "back") => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear canvas before drawing
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    if (view === "front") {
      // Head
      ctx.moveTo(200, 60);
      ctx.bezierCurveTo(230, 60, 240, 80, 240, 100);
      ctx.bezierCurveTo(240, 130, 220, 150, 200, 150);
      ctx.bezierCurveTo(180, 150, 160, 130, 160, 100);
      ctx.bezierCurveTo(160, 80, 170, 60, 200, 60);
      ctx.closePath();
      ctx.stroke();

      // Neck
      ctx.beginPath();
      ctx.moveTo(185, 150); ctx.lineTo(185, 170);
      ctx.moveTo(215, 150); ctx.lineTo(215, 170);
      ctx.stroke();

      // Torso
      ctx.beginPath();
      ctx.moveTo(185, 170);
      ctx.bezierCurveTo(160, 180, 140, 210, 140, 250);
      ctx.bezierCurveTo(140, 300, 160, 340, 185, 350);
      ctx.lineTo(185, 550);
      ctx.bezierCurveTo(170, 560, 165, 580, 165, 600);
      ctx.bezierCurveTo(165, 620, 170, 640, 185, 650);
      ctx.lineTo(185, 730);
      ctx.bezierCurveTo(185, 750, 190, 760, 200, 760);
      ctx.bezierCurveTo(210, 760, 215, 750, 215, 730);
      ctx.lineTo(215, 650);
      ctx.bezierCurveTo(230, 640, 235, 620, 235, 600);
      ctx.bezierCurveTo(235, 580, 230, 560, 215, 550);
      ctx.lineTo(215, 350);
      ctx.bezierCurveTo(240, 340, 260, 300, 260, 250);
      ctx.bezierCurveTo(260, 210, 240, 180, 215, 170);
      ctx.closePath();
      ctx.stroke();

      // Chest line
      ctx.beginPath();
      ctx.moveTo(150, 230);
      ctx.bezierCurveTo(165, 220, 235, 220, 250, 230);
      ctx.stroke();

      // Navel
      ctx.beginPath();
      ctx.arc(200, 380, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Abdominal muscle lines
      ctx.beginPath();
      ctx.moveTo(190, 320); ctx.lineTo(190, 440);
      ctx.moveTo(210, 320); ctx.lineTo(210, 440);
      ctx.moveTo(185, 340); ctx.lineTo(215, 340);
      ctx.moveTo(185, 380); ctx.lineTo(215, 380);
      ctx.moveTo(185, 420); ctx.lineTo(215, 420);
      ctx.stroke();

      // Inner thigh/groin
      ctx.beginPath();
      ctx.moveTo(195, 550);
      ctx.bezierCurveTo(198, 560, 202, 560, 205, 550);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(140, 200);
      ctx.bezierCurveTo(120, 220, 100, 280, 100, 350);
      ctx.bezierCurveTo(100, 420, 120, 480, 140, 500);
      ctx.lineTo(140, 650);
      ctx.bezierCurveTo(130, 670, 120, 700, 120, 720);
      ctx.lineTo(120, 780);
      ctx.bezierCurveTo(130, 800, 140, 810, 150, 800);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(260, 200);
      ctx.bezierCurveTo(280, 220, 300, 280, 300, 350);
      ctx.bezierCurveTo(300, 420, 280, 480, 260, 500);
      ctx.lineTo(260, 650);
      ctx.bezierCurveTo(270, 670, 280, 700, 280, 720);
      ctx.lineTo(280, 780);
      ctx.bezierCurveTo(270, 800, 260, 810, 250, 800);
      ctx.stroke();

      // Hands
      ctx.beginPath();
      ctx.moveTo(120, 780);
      ctx.bezierCurveTo(110, 790, 100, 800, 100, 820);
      ctx.bezierCurveTo(100, 840, 110, 850, 120, 840);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(280, 780);
      ctx.bezierCurveTo(290, 790, 300, 800, 300, 820);
      ctx.bezierCurveTo(300, 840, 290, 850, 280, 840);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(185, 760);
      ctx.lineTo(185, 830);
      ctx.bezierCurveTo(185, 840, 190, 850, 195, 850);
      ctx.lineTo(195, 870);
      ctx.bezierCurveTo(195, 880, 190, 890, 185, 890);
      ctx.lineTo(175, 890);
      ctx.bezierCurveTo(165, 890, 155, 880, 155, 870);
      ctx.lineTo(155, 850);
      ctx.bezierCurveTo(155, 840, 160, 830, 165, 830);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(215, 760);
      ctx.lineTo(215, 830);
      ctx.bezierCurveTo(215, 840, 210, 850, 205, 850);
      ctx.lineTo(205, 870);
      ctx.bezierCurveTo(205, 880, 210, 890, 215, 890);
      ctx.lineTo(225, 890);
      ctx.bezierCurveTo(235, 890, 245, 880, 245, 870);
      ctx.lineTo(245, 850);
      ctx.bezierCurveTo(245, 840, 240, 830, 235, 830);
      ctx.stroke();

      // Feet
      ctx.beginPath();
      ctx.moveTo(175, 890);
      ctx.lineTo(180, 900);
      ctx.lineTo(200, 900);
      ctx.lineTo(195, 890);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(225, 890);
      ctx.lineTo(220, 900);
      ctx.lineTo(200, 900);
      ctx.lineTo(205, 890);
      ctx.closePath();
      ctx.stroke();

      // Toes
      ctx.beginPath();
      ctx.moveTo(180, 900); ctx.lineTo(180, 910);
      ctx.moveTo(190, 900); ctx.lineTo(190, 910);
      ctx.moveTo(220, 900); ctx.lineTo(220, 910);
      ctx.moveTo(210, 900); ctx.lineTo(210, 910);
      ctx.stroke();

    } else { // Back View
      // Head
      ctx.beginPath();
      ctx.moveTo(200, 60);
      ctx.bezierCurveTo(230, 60, 240, 80, 240, 100);
      ctx.bezierCurveTo(240, 130, 220, 150, 200, 150);
      ctx.bezierCurveTo(180, 150, 160, 130, 160, 100);
      ctx.bezierCurveTo(160, 80, 170, 60, 200, 60);
      ctx.closePath();
      ctx.stroke();

      // Neck
      ctx.beginPath();
      ctx.moveTo(185, 150); ctx.lineTo(185, 170);
      ctx.moveTo(215, 150); ctx.lineTo(215, 170);
      ctx.stroke();

      // Torso (back)
      ctx.beginPath();
      ctx.moveTo(185, 170);
      ctx.bezierCurveTo(160, 180, 140, 210, 140, 250);
      ctx.bezierCurveTo(140, 300, 160, 340, 185, 350);
      ctx.lineTo(185, 550);
      ctx.bezierCurveTo(170, 560, 165, 580, 165, 600);
      ctx.bezierCurveTo(165, 620, 170, 640, 185, 650);
      ctx.lineTo(185, 730);
      ctx.bezierCurveTo(185, 750, 190, 760, 200, 760);
      ctx.bezierCurveTo(210, 760, 215, 750, 215, 730);
      ctx.lineTo(215, 650);
      ctx.bezierCurveTo(230, 640, 235, 620, 235, 600);
      ctx.bezierCurveTo(235, 580, 230, 560, 215, 550);
      ctx.lineTo(215, 350);
      ctx.bezierCurveTo(240, 340, 260, 300, 260, 250);
      ctx.bezierCurveTo(260, 210, 240, 180, 215, 170);
      ctx.closePath();
      ctx.stroke();

      // Shoulder blades
      ctx.beginPath();
      ctx.moveTo(165, 220);
      ctx.bezierCurveTo(160, 230, 160, 250, 165, 260);
      ctx.bezierCurveTo(170, 270, 185, 270, 190, 260);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(235, 220);
      ctx.bezierCurveTo(240, 230, 240, 250, 235, 260);
      ctx.bezierCurveTo(230, 270, 215, 270, 210, 260);
      ctx.stroke();

      // Spinal column line
      ctx.beginPath();
      ctx.moveTo(200, 170); ctx.lineTo(200, 550);
      ctx.stroke();

      // Buttocks area
      ctx.beginPath();
      ctx.moveTo(165, 550);
      ctx.bezierCurveTo(155, 570, 155, 600, 165, 620);
      ctx.bezierCurveTo(175, 640, 225, 640, 235, 620);
      ctx.bezierCurveTo(245, 600, 245, 570, 235, 550);
      ctx.stroke();

      // Arms (same as front, generally)
      ctx.beginPath();
      ctx.moveTo(140, 200);
      ctx.bezierCurveTo(120, 220, 100, 280, 100, 350);
      ctx.bezierCurveTo(100, 420, 120, 480, 140, 500);
      ctx.lineTo(140, 650);
      ctx.bezierCurveTo(130, 670, 120, 700, 120, 720);
      ctx.lineTo(120, 780);
      ctx.bezierCurveTo(130, 800, 140, 810, 150, 800);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(260, 200);
      ctx.bezierCurveTo(280, 220, 300, 280, 300, 350);
      ctx.bezierCurveTo(300, 420, 280, 480, 260, 500);
      ctx.lineTo(260, 650);
      ctx.bezierCurveTo(270, 670, 280, 700, 280, 720);
      ctx.lineTo(280, 780);
      ctx.bezierCurveTo(270, 800, 260, 810, 250, 800);
      ctx.stroke();

      // Hands
      ctx.beginPath();
      ctx.moveTo(120, 780);
      ctx.bezierCurveTo(110, 790, 100, 800, 100, 820);
      ctx.bezierCurveTo(100, 840, 110, 850, 120, 840);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(280, 780);
      ctx.bezierCurveTo(290, 790, 300, 800, 300, 820);
      ctx.bezierCurveTo(300, 840, 290, 850, 280, 840);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(185, 760);
      ctx.lineTo(185, 830);
      ctx.bezierCurveTo(185, 840, 190, 850, 195, 850);
      ctx.lineTo(195, 870);
      ctx.bezierCurveTo(195, 880, 190, 890, 185, 890);
      ctx.lineTo(175, 890);
      ctx.bezierCurveTo(165, 890, 155, 880, 155, 870);
      ctx.lineTo(155, 850);
      ctx.bezierCurveTo(155, 840, 160, 830, 165, 830);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(215, 760);
      ctx.lineTo(215, 830);
      ctx.bezierCurveTo(215, 840, 210, 850, 205, 850);
      ctx.lineTo(205, 870);
      ctx.bezierCurveTo(205, 880, 210, 890, 215, 890);
      ctx.lineTo(225, 890);
      ctx.bezierCurveTo(235, 890, 245, 880, 245, 870);
      ctx.lineTo(245, 850);
      ctx.bezierCurveTo(245, 840, 240, 830, 235, 830);
      ctx.stroke();

      // Calf muscles
      ctx.beginPath();
      ctx.moveTo(175, 820);
      ctx.bezierCurveTo(178, 830, 178, 840, 175, 850);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(225, 820);
      ctx.bezierCurveTo(222, 830, 222, 840, 225, 850);
      ctx.stroke();

      // Feet
      ctx.beginPath();
      ctx.moveTo(175, 890);
      ctx.lineTo(180, 900);
      ctx.lineTo(200, 900);
      ctx.lineTo(195, 890);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(225, 890);
      ctx.lineTo(220, 900);
      ctx.lineTo(200, 900);
      ctx.lineTo(205, 890);
      ctx.closePath();
      ctx.stroke();

      // Toes
      ctx.beginPath();
      ctx.moveTo(180, 900); ctx.lineTo(180, 910);
      ctx.moveTo(190, 900); ctx.lineTo(190, 910);
      ctx.moveTo(220, 900); ctx.lineTo(220, 910);
      ctx.moveTo(210, 900); ctx.lineTo(210, 910);
      ctx.stroke();
    }

    // Draw dots
    ctx.fillStyle = "red";
    dots.filter(dot => dot.view === view).forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [dots]); // Redraw when dots or view changes

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawBody(ctx, bodyView);
  }, [bodyView, dots, drawBody]); // Depend on bodyView and dots to redraw

  /* ---- Canvas Click Logic ---- */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = clientX * scaleX;
    const y = clientY * scaleY;

    // Check if clicked on an existing dot to remove it
    const dotRemoved = dots.some(dot => {
      if (dot.view === bodyView) {
        const distance = Math.sqrt(Math.pow(dot.x - x, 2) + Math.pow(dot.y - y, 2));
        if (distance < 10) { // Click radius for removing a dot
          removeDot(dot.id);
          return true;
        }
      }
      return false;
    });

    // If no dot was removed, add a new one
    if (!dotRemoved) {
      setDots((prev) => [...prev, { id: `${Date.now()}`, x, y, view: bodyView }]);
    }
  };

  const removeDot = (id: string) => setDots((prev) => prev.filter((d) => d.id !== id));

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
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-auto cursor-crosshair border"
                    onClick={handleCanvasClick}
                  >
                    Your browser does not support the HTML canvas tag.
                  </canvas>
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
