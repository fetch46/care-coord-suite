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
import { Badge } from "@/components/ui/badge";
import { Printer, Save, FileCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

// Pressure sore zone regions mapped to canvas coordinates (CANVAS_WIDTH=400, CANVAS_HEIGHT=920)
// Each zone has a bounding area for front and/or back view
interface ZoneRegion {
  view: BodyView;
  x: number; // center x
  y: number; // center y
  radius: number; // detection radius
}

const PRESSURE_SORE_ZONES: Record<HotSpot, ZoneRegion[]> = {
  "Rime of Ear": [
    { view: "front", x: 155, y: 95, radius: 25 },
    { view: "front", x: 245, y: 95, radius: 25 },
    { view: "back", x: 155, y: 95, radius: 25 },
    { view: "back", x: 245, y: 95, radius: 25 },
  ],
  "Shoulder Blade": [
    { view: "back", x: 150, y: 250, radius: 35 },
    { view: "back", x: 250, y: 250, radius: 35 },
  ],
  "Elbow": [
    { view: "front", x: 105, y: 400, radius: 30 },
    { view: "front", x: 295, y: 400, radius: 30 },
    { view: "back", x: 105, y: 400, radius: 30 },
    { view: "back", x: 295, y: 400, radius: 30 },
  ],
  "Sacrum": [
    { view: "back", x: 200, y: 440, radius: 35 },
  ],
  "Hip": [
    { view: "front", x: 135, y: 460, radius: 30 },
    { view: "front", x: 265, y: 460, radius: 30 },
    { view: "back", x: 135, y: 460, radius: 30 },
    { view: "back", x: 265, y: 460, radius: 30 },
  ],
  "Inner Knee": [
    { view: "front", x: 170, y: 620, radius: 28 },
    { view: "front", x: 230, y: 620, radius: 28 },
    { view: "back", x: 170, y: 620, radius: 28 },
    { view: "back", x: 230, y: 620, radius: 28 },
  ],
  "Outer Ankle": [
    { view: "front", x: 145, y: 810, radius: 22 },
    { view: "front", x: 255, y: 810, radius: 22 },
    { view: "back", x: 145, y: 810, radius: 22 },
    { view: "back", x: 255, y: 810, radius: 22 },
  ],
  "Heel": [
    { view: "back", x: 160, y: 880, radius: 25 },
    { view: "back", x: 240, y: 880, radius: 25 },
  ],
};

// Detect which pressure sore zone a click falls in
const detectZone = (x: number, y: number, view: BodyView): HotSpot | null => {
  for (const [area, zones] of Object.entries(PRESSURE_SORE_ZONES)) {
    for (const zone of zones) {
      if (zone.view === view) {
        const dist = Math.sqrt(Math.pow(x - zone.x, 2) + Math.pow(y - zone.y, 2));
        if (dist <= zone.radius) {
          return area as HotSpot;
        }
      }
    }
  }
  return null;
};

interface Dot {
  id: string;
  x: number;
  y: number;
  view: BodyView;
  matchedZone?: HotSpot | null;
}

interface HotSpotRecord {
  area: HotSpot;
  status: Status;
  notes: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  room_number: string;
}

interface Allergy {
  id: string;
  allergy_name: string;
  severity: string;
  reaction: string;
  notes: string;
}

interface FormState {
  id?: string;
  date: string;
  patientId: string;
  patientName: string;
  physician: string;
  room: string;
  records: HotSpotRecord[];
  dots: Dot[];
  bodyView: BodyView;
  generalNotes: string;
  status: 'draft' | 'completed' | 'reviewed';
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
  patientId: "",
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
  generalNotes: "",
  status: "draft",
};

export default function SkinAssessmentForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientAllergies, setSelectedPatientAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image: frontImage, error: frontError } = useImageLoader("/Front.png");
  const { image: backImage, error: backError } = useImageLoader("/Back.png");

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, room_number")
        .eq("status", "Active")
        .order("last_name");

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAllergies = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("patient_id", patientId);

      if (error) throw error;
      setSelectedPatientAllergies(data || []);
    } catch (error) {
      console.error("Error fetching allergies:", error);
      setSelectedPatientAllergies([]);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      dispatch({ type: "UPDATE_FIELD", field: "patientId", value: patientId });
      dispatch({ type: "UPDATE_FIELD", field: "patientName", value: `${patient.first_name} ${patient.last_name}` });
      dispatch({ type: "UPDATE_FIELD", field: "room", value: patient.room_number || "" });
      
      // Fetch patient allergies
      fetchPatientAllergies(patientId);
    }
  };

  // Handle errors
  useEffect(() => {
    if (frontError) console.error(frontError);
    if (backError) console.error(backError);
  }, [frontError, backError]);

  // Form validation
  const validateForm = (): boolean => {
    if (!state.patientId.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return false;
    }
    if (!state.physician.trim()) {
      toast({
        title: "Validation Error", 
        description: "Attending physician is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Save as draft
  const handleSaveDraft = async () => {
    if (!state.patientId) {
      toast({
        title: "Error",
        description: "Please select a patient first",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const assessmentData = {
        patient_id: state.patientId,
        date: state.date,
        attending_physician: state.physician,
        room_number: state.room,
        body_annotations: {
          dots: state.dots,
          bodyView: state.bodyView
        },
        hot_spot_assessments: state.records.reduce((acc, record) => {
          acc[record.area] = {
            status: record.status,
            notes: record.notes
          };
          return acc;
        }, {} as any),
        general_notes: state.generalNotes,
        status: 'draft'
      };

      let result;
      if (state.id) {
        result = await supabase
          .from('skin_assessments')
          .update(assessmentData)
          .eq('id', state.id);
      } else {
        result = await supabase
          .from('skin_assessments')
          .insert([assessmentData])
          .select();
      }

      if (result.error) throw result.error;

      if (result.data && result.data[0] && !state.id) {
        dispatch({ type: "UPDATE_FIELD", field: "id", value: result.data[0].id });
      }

      toast({
        title: "Success",
        description: "Assessment saved as draft",
      });
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Complete assessment
  const handleCompleteAssessment = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const assessmentData = {
        patient_id: state.patientId,
        date: state.date,
        attending_physician: state.physician,
        room_number: state.room,
        body_annotations: {
          dots: state.dots,
          bodyView: state.bodyView
        },
        hot_spot_assessments: state.records.reduce((acc, record) => {
          acc[record.area] = {
            status: record.status,
            notes: record.notes
          };
          return acc;
        }, {} as any),
        general_notes: state.generalNotes,
        status: 'completed'
      };

      let result;
      if (state.id) {
        result = await supabase
          .from('skin_assessments')
          .update(assessmentData)
          .eq('id', state.id);
      } else {
        result = await supabase
          .from('skin_assessments')
          .insert([assessmentData])
          .select();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Assessment completed successfully",
      });

      // Reset form after completion
      dispatch({ type: "LOAD_STATE", payload: initialState });
      setSelectedPatientAllergies([]);
    } catch (error) {
      console.error("Error completing assessment:", error);
      toast({
        title: "Error", 
        description: "Failed to complete assessment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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

      // Draw pressure zone indicators (subtle outlines)
      Object.entries(PRESSURE_SORE_ZONES).forEach(([area, zones]) => {
        const record = state.records.find(r => r.area === area);
        zones.filter(z => z.view === state.bodyView).forEach(zone => {
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
          if (record?.status === "Abnormal") {
            ctx.fillStyle = "rgba(239, 68, 68, 0.12)";
            ctx.fill();
            ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
          } else {
            ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
          }
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      });

      // Draw annotation dots - bigger, with pulse ring and label
      state.dots
        .filter((dot) => dot.view === state.bodyView)
        .forEach((dot) => {
          const DOT_RADIUS = 10;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS + 6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
          ctx.fill();

          // Main circle
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = dot.matchedZone ? "rgba(239, 68, 68, 0.9)" : "rgba(249, 115, 22, 0.9)";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label
          if (dot.matchedZone) {
            ctx.font = "bold 11px sans-serif";
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.textAlign = "center";
            const labelY = dot.y - DOT_RADIUS - 8;
            const textWidth = ctx.measureText(dot.matchedZone).width;
            // Background for label
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.beginPath();
            ctx.roundRect(dot.x - textWidth / 2 - 4, labelY - 10, textWidth + 8, 16, 4);
            ctx.fill();
            ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();
            // Text
            ctx.fillStyle = "rgba(185, 28, 28, 1)";
            ctx.fillText(dot.matchedZone, dot.x, labelY);
          }
        });
    };

    requestAnimationFrame(draw);
  }, [state.bodyView, state.dots, state.records, frontImage, backImage]);

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

    // Check if clicked on existing dot (use bigger hit area matching the bigger dot)
    const dotClicked = state.dots.find((dot) => {
      if (dot.view === state.bodyView) {
        const distance = Math.sqrt(Math.pow(dot.x - x, 2) + Math.pow(dot.y - y, 2));
        return distance < 16;
      }
      return false;
    });

    if (dotClicked) {
      dispatch({ type: "REMOVE_DOT", id: dotClicked.id });
    } else {
      // Detect if the click is in a pressure sore zone
      const matchedZone = detectZone(x, y, state.bodyView);
      
      dispatch({
        type: "ADD_DOT",
        dot: {
          id: `${Date.now()}`,
          x,
          y,
          view: state.bodyView,
          matchedZone,
        },
      });

      // Auto-mark the matched zone as Abnormal
      if (matchedZone) {
        dispatch({ type: "UPDATE_RECORD", area: matchedZone, patch: { status: "Abnormal" as Status } });
        toast({
          title: `${matchedZone} marked`,
          description: "Area flagged as abnormal. Add notes in the checklist below.",
        });
      }
    }
  };

  // Memoized HotSpotItem component
  const HotSpotItem = useCallback(
    ({ area, status, notes }: HotSpotRecord) => {
      const annotationCount = state.dots.filter(d => d.matchedZone === area).length;
      return (
      <div className={`border rounded-lg p-4 space-y-2 transition-colors ${status === "Abnormal" ? "border-destructive/40 bg-destructive/5" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{area}</span>
            {annotationCount > 0 && (
              <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                {annotationCount} mark{annotationCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
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
    );
    },
    [state.dots]
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
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={state.date}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "date",
                        value: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                
                <div>
                  <Label>Patient Name</Label>
                  <Select
                    value={state.patientId}
                    onValueChange={handlePatientSelect}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading patients..." : "Select a patient"} />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} - Room {patient.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Attending Physician</Label>
                  <Input
                    value={state.physician}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "physician",
                        value: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Room</Label>
                  <Input
                    value={state.room}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "room",
                        value: e.target.value,
                      })
                    }
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            {/* Patient Allergies Display */}
            {selectedPatientAllergies.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    Patient Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {selectedPatientAllergies.map((allergy) => (
                      <div key={allergy.id} className="flex items-center gap-3 p-3 bg-white rounded border border-red-200">
                        <Badge 
                          variant={allergy.severity === 'severe' ? 'destructive' : 
                                   allergy.severity === 'moderate' ? 'default' : 'secondary'}
                        >
                          {allergy.severity?.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <span className="font-medium text-red-900">{allergy.allergy_name}</span>
                          {allergy.reaction && (
                            <p className="text-sm text-red-700">Reaction: {allergy.reaction}</p>
                          )}
                          {allergy.notes && (
                            <p className="text-xs text-red-600">{allergy.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                    Click to annotate. Annotations on pressure sore zones auto-flag them as abnormal. Click a dot to remove it.
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
                  
                  {/* General Notes */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="generalNotes">General Notes</Label>
                    <Textarea
                      id="generalNotes"
                      value={state.generalNotes}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "generalNotes",
                          value: e.target.value,
                        })
                      }
                      placeholder="Add any additional observations or notes about the patient's skin condition..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={saving || !state.patientId}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={handleCompleteAssessment}
                  disabled={saving || !state.patientId}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  {saving ? "Completing..." : "Complete Assessment"}
                </Button>
              </div>
              
              <Button
                onClick={() => window.print()}
                variant="outline"
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
