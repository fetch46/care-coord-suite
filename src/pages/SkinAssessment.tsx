import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function useCanvasDrawing(canvasRef: React.RefObject<HTMLCanvasElement>, storageKey: string) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    // Load saved drawing
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = saved;
    }

    const startDraw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing = true;
      draw(e);
    };

    const endDraw = () => {
      drawing = false;
      ctx?.beginPath();
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#FF0000";

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", endDraw);

    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchend", endDraw);
    canvas.addEventListener("touchmove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", endDraw);

      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchend", endDraw);
      canvas.removeEventListener("touchmove", draw);
    };
  }, [canvasRef, storageKey]);
}

export default function SkinAssessmentForm() {
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    skinCondition: "",
    notes: "",
  });

  useCanvasDrawing(frontCanvasRef, "skinAssessmentFront");
  useCanvasDrawing(backCanvasRef, "skinAssessmentBack");

  const handleSave = () => {
    if (frontCanvasRef.current) {
      localStorage.setItem("skinAssessmentFront", frontCanvasRef.current.toDataURL());
    }
    if (backCanvasRef.current) {
      localStorage.setItem("skinAssessmentBack", backCanvasRef.current.toDataURL());
    }
    alert("Saved!");
  };

  const handleClear = () => {
    [frontCanvasRef, backCanvasRef].forEach((ref) => {
      const canvas = ref.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
    localStorage.removeItem("skinAssessmentFront");
    localStorage.removeItem("skinAssessmentBack");
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Skin Assessment Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="skinCondition">Skin Condition</Label>
            <Input
              id="skinCondition"
              value={formData.skinCondition}
              onChange={(e) =>
                setFormData({ ...formData, skinCondition: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="notes">Observation Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save Diagrams</Button>
            <Button variant="destructive" onClick={handleClear}>Clear Diagrams</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Draw on Body Diagram</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <div>
            <Label className="block text-center mb-2">Front View</Label>
            <canvas
              ref={frontCanvasRef}
              width={300}
              height={500}
              className="border border-gray-300 rounded shadow-md bg-white"
            />
          </div>
          <div>
            <Label className="block text-center mb-2">Back View</Label>
            <canvas
              ref={backCanvasRef}
              width={300}
              height={500}
              className="border border-gray-300 rounded shadow-md bg-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
