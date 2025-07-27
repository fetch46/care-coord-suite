"use client";
import { useEffect, useState, useRef, useCallback, useReducer } from "react";
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
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Types
type BodyView = "front" | "back";
type Status = "Normal" | "Abnormal";

const HOT_SPOTS = {
  RIME_OF_EAR: "Rime of Ear",
  SHOULDER_BLADE: "Shoulder Blade",
  ELBOW: "Elbow",
  SACRUM: "Sacrum",
  HIP: "Hip",
  INNER_KNEE: "Inner Knee",
  OUTER_ANKLE: "Outer Ankle",
  HEEL: "Heel",
} as const;

type HotSpot = typeof HOT_SPOTS[keyof typeof HOT_SPOTS];

interface Dot {
  id: string;
  x: number;
  y: number;
  view: BodyView;
}

interface HotSpotRecord {
  area: HotSpot;
  status: Status;
  notes: string;
}

interface FormState {
  date: string;
  patientName: string;
  physician: string;
  room: string;
  records: HotSpotRecord[];
  dots: Dot[];
  bodyView: BodyView;
}

// Storage service
const storage = {
  get: (key: string): FormState | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to parse storage item", error);
      return null;
    }
  },
  set: (key: string, value: FormState) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// Custom hook for image loading
const useImageLoader = (src: string) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
    img.onerror = (e) => setError(new Error(`Failed to load image: ${src}`));

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { image, error };
};

// Constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 920;

// Reducer for complex state
const formReducer = (state: FormState, action: any) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) =>
          r.area === action.area ? { ...r, ...action.patch } : r
        ),
      };
    case "ADD_DOT":
      return { ...state, dots: [...state.dots, action.dot] };
    case "REMOVE_DOT":
      return { ...state, dots: state.dots.filter((d) => d.id !== action.id) };
    case "CLEAR_DOTS":
      return { ...state, dots: [] };
    case "SET_BODY_VIEW":
      return { ...state, bodyView: action.view };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialState: FormState = {
  date: new Date().toISOString().slice(0, 10),
  patientName: "",
  physician: "",
  room: "",
  records: Object.values(HOT_SPOTS).map((a) => ({
    area: a,
    status: "Normal",
    notes: "",
  })),
  dots: [],
  bodyView: "front",
};

export default function SkinAssessmentForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image: frontImage, error: frontError } = useImageLoader("/Front.png");
  const { image: backImage, error: backError } = useImageLoader("/Back.png");

  // Load saved data
  useEffect(() => {
    const saved = storage.get("skinAssessment");
    if (saved) {
      dispatch({ type: "LOAD_STATE", payload: saved });
    }
  }, []);

  // Handle errors
  useEffect(() => {
    if (frontError) console.error(frontError);
    if (backError) console.error(backError);
  }, [frontError, backError]);

  // Form validation
  const validateForm = (): boolean => {
    if (!state.patientName.trim()) {
      toast.error("Patient name is required");
      return false;
    }
    return true;
  };

  // Save handler
  const handleSave = useCallback(() => {
    if (!validateForm()) return;
    storage.set("skinAssessment", state);
    toast.success("Assessment saved successfully!");
  }, [state]);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      const currentImage = state.bodyView === "front" ? frontImage : backImage;
      if (currentImage) {
        ctx.drawImage(currentImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      ctx.fillStyle = "red";
      state.dots
        .filter((dot) => dot.view === state.bodyView)
        .forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
    };

    requestAnimationFrame(draw);
  }, [state.bodyView, state.dots, frontImage, backImage]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Canvas click handler
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

    // Check if clicked on existing dot
    const dotClicked = state.dots.find((dot) => {
      if (dot.view === state.bodyView) {
        const distance = Math.sqrt(Math.pow(dot.x - x, 2) + Math.pow(dot.y - y, 2));
        return distance < 10;
      }
      return false;
    });

    if (dotClicked) {
      dispatch({ type: "REMOVE_DOT", id: dotClicked.id });
    } else {
      dispatch({
        type: "ADD_DOT",
        dot: {
          id: `${Date.now()}`,
          x,
          y,
          view: state.bodyView,
        },
      });
    }
  };

  // Memoized HotSpotItem component
  const HotSpotItem = useCallback(
    ({ area, status, notes }: HotSpotRecord) => (
      <div className="border rounded p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{area}</span>
          <RadioGroup
            value={status}
            onValueChange={(val: Status) =>
              dispatch({ type: "UPDATE_RECORD", area, patch: { status: val } })
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
              dispatch({
                type: "UPDATE_RECORD",
                area,
                patch: { notes: e.target.value },
              })
            }
            placeholder="Describe any broken, bruised or reddened areas"
            rows={2}
          />
        )}
      </div>
    ),
    []
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skin Assessment Sheet</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Date",
                    value: state.date,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "date",
                        value: e.target.value,
                      }),
                    type: "date",
                  },
                  {
                    label: "Patient Name",
                    value: state.patientName,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "patientName",
                        value: e.target.value,
                      }),
                  },
                  {
                    label: "Attending Physician",
                    value: state.physician,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "physician",
                        value: e.target.value,
                      }),
                  },
                  {
                    label: "Room",
                    value: state.room,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "room",
                        value: e.target.value,
                      }),
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <Label>{field.label}</Label>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type={field.type || "text"}
                      required
                      aria-required="true"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Body Diagram */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Body Diagram – Click/Tap to Annotate</CardTitle>
                </CardHeader>
                <CardContent className="relative w-full max-w-sm mx-auto">
                  <div className="mb-4">
                    <Label className="text-sm">Select View</Label>
                    <Select
                      value={state.bodyView}
                      onValueChange={(val: BodyView) =>
                        dispatch({ type: "SET_BODY_VIEW", view: val })
                      }
                    >
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
                    aria-label="Body diagram canvas for marking skin issues"
                  >
                    Your browser does not support the HTML canvas tag.
                  </canvas>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Tap anywhere to add a red dot; tap the dot to remove.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => dispatch({ type: "CLEAR_DOTS" })}
                    >
                      Clear Annotations
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pressure Sores Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas Most Prone to Pressure Sores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.records.map((record) => (
                    <HotSpotItem key={record.area} {...record} />
                  ))}
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSave}>Save Assessment</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => window.print()}
                className="ml-auto"
                aria-label="Print or export form"
              >
                <Printer className="w-4 h-4 mr-2" aria-hidden="true" />
                Print / Export
              </Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
