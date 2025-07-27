"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const bodyAreas = [
  "Shoulder Blades",
  "Elbows",
  "Sacrum",
  "Ischium",
  "Trochanters",
  "Heels",
  "Ankles",
  "Back of the Head",
];

interface FormData {
  name: string;
  observations: string;
}

interface Record {
  area: string;
  status: "Normal" | "Abnormal";
  notes: string;
}

export default function SkinAssessmentForm() {
  const [dots, setDots] = useState<{ x: number; y: number; view: string }[]>([]);
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [records, setRecords] = useState<Record[]>(
    bodyAreas.map((area) => ({
      area,
      status: "Normal",
      notes: "",
    }))
  );

  const updateRecord = (area: string, data: Partial<Record>) => {
    setRecords((prev) =>
      prev.map((r) => (r.area === area ? { ...r, ...data } : r))
    );
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDots([...dots, { x, y, view: bodyView }]);
  };

  const handleSaveSubmit = () => {
    console.log("Patient Info:", watch());
    console.log("Skin Condition:", records);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div>
            <Label htmlFor="observations">General Observations</Label>
            <Textarea id="observations" {...register("observations")} />
          </div>
        </CardContent>
      </Card>

      {/* Body Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Body Diagram ({bodyView.charAt(0).toUpperCase() + bodyView.slice(1)} View)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {bodyView === "front" ? "Front View" : "Back View"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => setBodyView("front")}>
                  Front View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBodyView("back")}>
                  Back View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative flex justify-center">
            <img
              src={bodyView === "front" ? "/front-body.svg" : "/back-body.svg"}
              alt={`${bodyView} view`}
              className="w-64 h-auto border rounded"
              onClick={handleImageClick}
            />
            {dots
              .filter((dot) => dot.view === bodyView)
              .map((dot, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3 bg-red-500 rounded-full"
                  style={{
                    left: dot.x,
                    top: dot.y,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
          </div>
          <div className="flex justify-center">
            <Button variant="destructive" onClick={() => setDots([])}>
              Clear Annotations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pressure Sore Checklist */}
      <Card className="md:col-span-2">
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
          <div className="flex justify-end">
            <Button onClick={handleSaveSubmit}>Save & Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
