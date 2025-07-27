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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Dot { id: string; x: number; y: number; view: "front" | "back"; }

const HOT_SPOTS = [
  "Rime of Ear", "Shoulder Blade", "Elbow", "Sacrum", "Hip",
  "Inner Knee", "Outer Ankle", "Heel",
] as const;
type HotSpot = typeof HOT_SPOTS[number];
interface HotSpotRecord { area: HotSpot; status: "Normal" | "Abnormal"; notes: string; }

export default function SkinAssessmentForm() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [patientName, setPatientName] = useState("");
  const [physician, setPhysician] = useState("");
  const [room, setRoom] = useState("");
  const [records, setRecords] = useState<HotSpotRecord[]>(() =>
    HOT_SPOTS.map((a) => ({ area: a, status: "Normal", notes: "" }))
  );
  const [dots, setDots] = useState<Dot[]>([]);
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frontImage, setFrontImage] = useState<HTMLImageElement | null>(null);
  const [backImage, setBackImage] = useState<HTMLImageElement | null>(null);
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 920;

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

  useEffect(() => {
    const loadImages = () => {
      const imgFront = new Image();
      imgFront.src = "/Front.png";
      imgFront.onload = () => setFrontImage(imgFront);
      imgFront.onerror = () => console.error("Failed to load Front.png");
      const imgBack = new Image();
      imgBack.src = "/Back.png";
      imgBack.onload = () => setBackImage(imgBack);
      imgBack.onerror = () => console.error("Failed to load Back.png");
    };
    loadImages();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (bodyView === "front" && frontImage) {
      ctx.drawImage(frontImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (bodyView === "back" && backImage) {
      ctx.drawImage(backImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    ctx.fillStyle = "red";
    dots.filter(dot => dot.view === bodyView).forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [bodyView, dots, frontImage, backImage]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

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
    const dotRemoved = dots.some(dot => {
      if (dot.view === bodyView) {
        const distance = Math.sqrt(Math.pow(dot.x - x, 2) + Math.pow(dot.y - y, 2));
        if (distance < 10) {
          removeDot(dot.id);
          return true;
        }
      }
      return false;
    });
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
            <Card>
              <CardHeader><CardTitle>Skin Assessment Sheet</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div><Label>Patient Name</Label><Input value={patientName} onChange={(e) => setPatientName(e.target.value)} /></div>
                <div><Label>Attending Physician</Label><Input value={physician} onChange={(e) => setPhysician(e.target.value)} /></div>
                <div><Label>Room</Label><Input value={room} onChange={(e) => setRoom(e.target.value)} /></div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Body Diagram */}
              <Card className="h-fit">
                <CardHeader><CardTitle>Body Diagram – Click/Tap to Annotate</CardTitle></CardHeader>
                <CardContent className="relative w-full max-w-sm mx-auto">
                  <div className="mb-4">
                    <Label className="text-sm">Select View</Label>
                    <Select value={bodyView} onValueChange={(val) => setBodyView(val as "front" | "back")}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Front View</SelectItem>
                        <SelectItem value="back">Back View</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDots([])}
                    >
                      Clear Annotations
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pressure Sores Checklist */}
              <Card>
                <CardHeader><CardTitle>Areas Most Prone to Pressure Sores</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {records.map(({ area, status, notes }) => (
                    <div key={area} className="border rounded p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{area}</span>
                        <RadioGroup
                          value={status}
                          onValueChange={(val: "Normal" | "Abnormal") => updateRecord(area, { status: val })}
                          className="flex gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="Normal" id={`${area}-normal`} />
                            <Label htmlFor={`${area}-normal`}>Normal</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="Abnormal" id={`${area}-abnormal`} />
                            <Label htmlFor={`${area}-abnormal`}>Abnormal</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {status === "Abnormal" && (
                        <Textarea
                          value={notes}
                          onChange={(e) => updateRecord(area, { notes: e.target.value })}
                          placeholder="Describe any broken, bruised or reddened areas"
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                  <Button onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />Save / Submit
            </Button>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />Print / Export
            </Button>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
