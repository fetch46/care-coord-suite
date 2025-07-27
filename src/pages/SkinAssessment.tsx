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

/* ------------------------------------------------------------------ */
/* 1.  Body-Diagram dot annotation                                     */
/* ------------------------------------------------------------------ */
interface Dot {
  id: string;
  x: number; // 0-100 %
  y: number;
}

/* ------------------------------------------------------------------ */
/* 2.  Pressure-sore checklist                                        */
/* ------------------------------------------------------------------ */
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

interface HotSpotRecord {
  area: HotSpot;
  status: "Normal" | "Abnormal";
  notes: string;
}

/* ------------------------------------------------------------------ */
/* 3.  Component                                                      */
/* ------------------------------------------------------------------ */
export default function SkinAssessmentForm() {
  /* ---------- Header fields ---------- */
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [patientName, setPatientName] = useState("");
  const [physician, setPhysician] = useState("");
  const [room, setRoom] = useState("");

  /* ---------- Pressure-sore records ---------- */
  const [records, setRecords] = useState<HotSpotRecord[]>(() =>
    HOT_SPOTS.map((area) => ({ area, status: "Normal", notes: "" }))
  );

  /* ---------- Body-diagram dots ---------- */
  const [dots, setDots] = useState<Dot[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  /* ---------- LocalStorage persist ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("skinAssessment");
    if (saved) {
      const { date, patientName, physician, room, records, dots: d } =
        JSON.parse(saved);
      setDate(date);
      setPatientName(patientName);
      setPhysician(physician);
      setRoom(room);
      setRecords(records);
      setDots(d || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "skinAssessment",
      JSON.stringify({ date, patientName, physician, room, records, dots })
    );
  }, [date, patientName, physician, room, records, dots]);

  /* ---------- Helpers ---------- */
  const updateRecord = (area: HotSpot, patch: Partial<HotSpotRecord>) =>
    setRecords((prev) =>
      prev.map((r) => (r.area === area ? { ...r, ...patch } : r))
    );

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDots((prev) => [...prev, { id: `${Date.now()}`, x, y }]);
  };

  const removeDot = (id: string) =>
    setDots((prev) => prev.filter((d) => d.id !== id));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* ---------- Header Card ---------- */}
            <Card>
              <CardHeader>
                <CardTitle>Skin Assessment Sheet</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Patient Name</Label>
                  <Input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Attending Physician</Label>
                  <Input
                    value={physician}
                    onChange={(e) => setPhysician(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Room</Label>
                  <Input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ---------- Side-by-Side Grid ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* --- LEFT: Body Diagram --- */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Body Diagram – Click to Annotate</CardTitle>
                </CardHeader>
                <CardContent className="relative w-full max-w-sm mx-auto">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 200 500"
                    className="w-full h-auto cursor-crosshair border"
                    onClick={handleSvgClick}
                  >
                    {/* Body outline from PDF */}
                    <path
                      d="
                        M100 20
                        C 80 20 70 30 70 40
                        L 70 80
                        C 60 90 50 110 50 130
                        L 50 160
                        C 50 170 55 180 60 190
                        L 65 200
                        L 65 280
                        L 55 320
                        L 55 470
                        C 55 485 65 490 70 490
                        L 90 490
                        C 95 490 100 485 100 470
                        L 100 320
                        L 110 320
                        L 110 470
                        C 110 485 115 490 120 490
                        L 140 490
                        C 145 490 150 485 150 470
                        L 150 320
                        L 140 280
                        L 140 200
                        L 145 190
                        C 150 180 155 170 155 160
                        L 155 130
                        C 155 110 145 90 135 80
                        L 135 40
                        C 135 30 130 20 100 20
                        Z
                      "
                      fill="#f7f7f7"
                      stroke="#333"
                      strokeWidth="1"
                    />

                    {/* Clicked dots */}
                    {dots.map((dot) => (
                      <g key={dot.id}>
                        <circle
                          cx={`${dot.x}%`}
                          cy={`${dot.y}%`}
                          r="4"
                          fill="red"
                        />
                        <circle
                          cx={`${dot.x}%`}
                          cy={`${dot.y}%`}
                          r="10"
                          fill="transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDot(dot.id);
                          }}
                          className="cursor-pointer"
                        />
                      </g>
                    ))}
                  </svg>
                  <p className="text-xs text-muted-foreground mt-2">
                    Tap anywhere on the diagram to mark an observation. Tap a red dot to remove it.
                  </p>
                </CardContent>
              </Card>

              {/* --- RIGHT: Pressure Sores Checklist --- */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas Most Prone to Pressure Sores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {records.map(({ area, status, notes }) => (
                    <div key={area} className="border rounded p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{area}</span>
                        <RadioGroup
                          value={status}
                          onValueChange={(val: "Normal" | "Abnormal") =>
                            updateRecord(area, { status: val })
                          }
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
                          onChange={(e) =>
                            updateRecord(area, { notes: e.target.value })
                          }
                          placeholder="Describe any broken, bruised or reddened areas"
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ---------- Print Button ---------- */}
            <Button onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              Print / Export
            </Button>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
