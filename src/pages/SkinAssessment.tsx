"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Coordinates for predefined dots per body area and view
const annotationCoordinates: Record<
  string,
  { front?: { x: number; y: number }; back?: { x: number; y: number } }
> = {
  "Shoulder Blades": {
    back: { x: 130, y: 80 },
  },
  Elbows: {
    front: { x: 120, y: 140 },
    back: { x: 120, y: 140 },
  },
  Sacrum: {
    back: { x: 130, y: 200 },
  },
  Ischium: {
    front: { x: 130, y: 220 },
  },
  Trochanters: {
    front: { x: 100, y: 210 },
    back: { x: 100, y: 210 },
  },
  Heels: {
    front: { x: 130, y: 320 },
    back: { x: 130, y: 320 },
  },
  Ankles: {
    front: { x: 110, y: 330 },
    back: { x: 110, y: 330 },
  },
  "Back of the Head": {
    back: { x: 130, y: 30 },
  },
};

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
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const [records, setRecords] = useState<Record[]>(
    bodyAreas.map((area) => ({
      area,
      status: "Normal",
      notes: "",
    }))
  );

  const [dots, setDots] = useState<
    { x: number; y: number; view: string; fromArea?: string }[]
  >([]);

  const handleImageClick = (
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDots((prev) => [...prev, { x, y, view: bodyView }]);
  };

  const updateRecord = (area: string, data: Partial<Record>) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.area === area ? { ...r, ...data } : r
      )
    );

    const coords = annotationCoordinates[area];

    // Remove existing dot from area
    setDots((prevDots) =>
      prevDots.filter((d) => d.fromArea !== area)
    );

    // Add new annotation if status is Abnormal
    if (data.status === "Abnormal") {
      const viewCoords = coords?.[bodyView];
      if (viewCoords) {
        setDots((prevDots) => [
          ...prevDots,
          {
            x: viewCoords.x,
            y: viewCoords.y,
            view: bodyView,
            fromArea: area,
          },
        ]);
      }
    }
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
            <Label htmlFor="observations">
              General Observations
            </Label>
            <Textarea
              id="observations"
              {...register("observations")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Body Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>
            Body Diagram (
            {bodyView.charAt(0).toUpperCase() + bodyView.slice(1)} View)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {bodyView === "front"
                    ? "Front View"
                    : "Back View"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem
                  onClick={() => setBodyView("front")}
                >
                  Front View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setBodyView("back")}
                >
                  Back View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative flex justify-center">
            <img
              src={
                bodyView === "front"
                  ? "/front-body.svg"
                  : "/back-body.svg"
              }
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
            <Button
              variant="destructive"
              onClick={() => setDots([])}
            >
              Clear Annotations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pressure Sore Checklist */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            Areas Most Prone to Pressure Sores
          </CardTitle>
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
                  onValueChange={(val) =>
                    updateRecord(area, {
                      status: val as "Normal" | "Abnormal",
                    })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="Normal"
                      id={`${area}-normal`}
                    />
                    <Label htmlFor={`${area}-normal`}>
                      Normal
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="Abnormal"
                      id={`${area}-abnormal`}
                    />
                    <Label htmlFor={`${area}-abnormal`}>
                      Abnormal
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {status === "Abnormal" && (
                <Textarea
                  value={notes}
                  onChange={(e) =>
                    updateRecord(area, {
                      notes: e.target.value,
                    })
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
