import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Printer, SaveIcon } from "lucide-react";

// ---------- PDF-matched data ----------
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

export default function SkinAssessmentForm() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [patientName, setPatientName] = useState("");
  const [physician, setPhysician] = useState("");
  const [room, setRoom] = useState("");
  const [records, setRecords] = useState<HotSpotRecord[]>(() =>
    HOT_SPOTS.map((area) => ({ area, status: "Normal", notes: "" }))
  );

  // ---------- LocalStorage ----------
  useEffect(() => {
    const saved = localStorage.getItem("skinAssessment");
    if (saved) {
      const { date, patientName, physician, room, records: r } = JSON.parse(saved);
      setDate(date);
      setPatientName(patientName);
      setPhysician(physician);
      setRoom(room);
      setRecords(r);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "skinAssessment",
      JSON.stringify({ date, patientName, physician, room, records })
    );
  }, [date, patientName, physician, room, records]);

  const updateRecord = (area: HotSpot, patch: Partial<HotSpotRecord>) =>
    setRecords((prev) =>
      prev.map((r) => (r.area === area ? { ...r, ...patch } : r))
    );

  const printForm = () => window.print();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header section */}
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
                    placeholder="Patient Name"
                  />
                </div>
                <div>
                  <Label>Attending Physician</Label>
                  <Input
                    value={physician}
                    onChange={(e) => setPhysician(e.target.value)}
                    placeholder="Attending Physician"
                  />
                </div>
                <div>
                  <Label>Room</Label>
                  <Input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hot-spot checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Areas Most Prone to Pressure Sores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {records.map(({ area, status, notes }) => (
                  <div
                    key={area}
                    className="border rounded p-4 space-y-2"
                  >
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
                        onChange={(e) => updateRecord(area, { notes: e.target.value })}
                        placeholder="Describe any broken, bruised or reddened areas"
                        rows={2}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={printForm}>
                <Printer className="w-4 h-4 mr-2" />
                Print / Export
              </Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
