import React, { useState, useEffect, useRef } from "react";

// Utility functions for localStorage auto-save
const STORAGE_KEY = "skinAssessmentFormDraft";

const saveDraft = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadDraft = () => {
  const draft = localStorage.getItem(STORAGE_KEY);
  return draft ? JSON.parse(draft) : null;
};

const initialFormState = {
  date: "",
  patientName: "",
  caregiverName: "",
  assessmentStatus: "normal",
  abnormalAreas: {
    front: [],
    back: [],
  },
  skinSheet: {
    name: "",
    age: "",
    physician: "",
    room: "",
    observations: [],
  },
};

// Annotatable Areas (SVG coordinates are approximate)
const AREAS = [
  { label: "Rim of Ear", id: "ear", coordsFront: [160, 40], coordsBack: [160, 40] },
  { label: "Shoulder Blade", id: "shoulder", coordsFront: [110, 70], coordsBack: [110, 70] },
  { label: "Elbow", id: "elbow", coordsFront: [90, 130], coordsBack: [90, 130] },
  { label: "Sacrum", id: "sacrum", coordsFront: [160, 200], coordsBack: [160, 200] },
  { label: "Hip", id: "hip", coordsFront: [120, 180], coordsBack: [120, 180] },
  { label: "Inner Knee", id: "innerKnee", coordsFront: [150, 260], coordsBack: [150, 260] },
  { label: "Outer Ankle", id: "outerAnkle", coordsFront: [110, 340], coordsBack: [110, 340] },
  { label: "Heel", id: "heel", coordsFront: [160, 370], coordsBack: [160, 370] },
];

// SVG Body Diagram Component
function BodyDiagram({ side, markedAreas, onMark }) {
  // SVG outline is simple for demo; can be replaced with detailed SVG for production
  const width = 320, height = 400;
  return (
    <svg width={width} height={height} style={{ background: "#f8f8f8", borderRadius: "10px" }}>
      {/* Body outline */}
      <ellipse cx={160} cy={120} rx={60} ry={95} fill="#eee" stroke="#888" strokeWidth="2" />
      {/* Arms */}
      <rect x={70} y={110} width={40} height={140} rx={20} fill="#eee" stroke="#888" strokeWidth="2" />
      <rect x={210} y={110} width={40} height={140} rx={20} fill="#eee" stroke="#888" strokeWidth="2" />
      {/* Head */}
      <ellipse cx={160} cy={40} rx={30} ry={30} fill="#eee" stroke="#888" strokeWidth="2" />

      {/* Annotatable areas */}
      {AREAS.map(area => {
        const coords = side === "front" ? area.coordsFront : area.coordsBack;
        const marked = markedAreas.includes(area.id);
        return (
          <circle
            key={area.id}
            cx={coords[0]}
            cy={coords[1]}
            r={18}
            fill={marked ? "#ffcccc" : "#cceeff"}
            stroke="#333"
            strokeWidth={marked ? 4 : 2}
            style={{ cursor: "pointer" }}
            onClick={() => onMark(area.id)}
          >
            <title>{area.label}</title>
          </circle>
        );
      })}
      {/* Labels for accessibility */}
      {AREAS.map(area => {
        const coords = side === "front" ? area.coordsFront : area.coordsBack;
        return (
          <text
            key={area.id + "-label"}
            x={coords[0]}
            y={coords[1] - 22}
            textAnchor="middle"
            fontSize="11"
            fill="#444"
          >
            {area.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function SkinAssessmentForm() {
  const [form, setForm] = useState(() => loadDraft() || initialFormState);
  const [printMode, setPrintMode] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-save
  useEffect(() => {
    saveDraft(form);
  }, [form]);

  // Print handler
  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  // Form field update helper
  const updateField = (path: string, value: any) => {
    setForm(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const segments = path.split(".");
      let obj = updated;
      for (let i = 0; i < segments.length - 1; i++) {
        obj = obj[segments[i]];
      }
      obj[segments[segments.length - 1]] = value;
      return updated;
    });
  };

  // Annotate area handler
  const handleAreaMark = (side: "front" | "back", areaId: string) => {
    setForm(prev => {
      const marked = prev.abnormalAreas[side];
      const newMarked = marked.includes(areaId)
        ? marked.filter((id: string) => id !== areaId)
        : [...marked, areaId];
      return {
        ...prev,
        abnormalAreas: {
          ...prev.abnormalAreas,
          [side]: newMarked,
        },
      };
    });
  };

  // Observations Table
  const addObservation = () => {
    setForm(prev => ({
      ...prev,
      skinSheet: {
        ...prev.skinSheet,
        observations: [
          ...prev.skinSheet.observations,
          { date: "", time: "", remarks: "" },
        ],
      },
    }));
  };

  const updateObservation = (idx: number, field: string, value: string) => {
    setForm(prev => {
      const observations = [...prev.skinSheet.observations];
      observations[idx][field] = value;
      return {
        ...prev,
        skinSheet: {
          ...prev.skinSheet,
          observations,
        },
      };
    });
  };

  const removeObservation = (idx: number) => {
    setForm(prev => {
      const observations = [...prev.skinSheet.observations];
      observations.splice(idx, 1);
      return {
        ...prev,
        skinSheet: {
          ...prev.skinSheet,
          observations,
        },
      };
    });
  };

  return (
    <div
      ref={formRef}
      className={`skin-assessment-form${printMode ? " print-mode" : ""}`}
      style={{
        maxWidth: 600,
        margin: "auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px #eee",
        padding: "16px 16px 40px 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Skin Assessment Form</h1>
      <section>
        <label>
          Date:
          <input
            type="date"
            value={form.date}
            onChange={e => updateField("date", e.target.value)}
            required
            style={{marginLeft: 8}}
          />
        </label>
        <br />
        <label>
          Patient’s Name:
          <input
            type="text"
            value={form.patientName}
            onChange={e => updateField("patientName", e.target.value)}
            required
            style={{marginLeft: 8}}
          />
        </label>
        <br />
        <label>
          Caregiver’s/Staff’s Name:
          <input
            type="text"
            value={form.caregiverName}
            onChange={e => updateField("caregiverName", e.target.value)}
            required
            style={{marginLeft: 8}}
          />
        </label>
        <br />
        <label>
          Assessment Status:
          <input
            type="radio"
            name="assessmentStatus"
            value="normal"
            checked={form.assessmentStatus === "normal"}
            onChange={e => updateField("assessmentStatus", "normal")}
            style={{marginLeft: 8}}
          />
          Normal
          <input
            type="radio"
            name="assessmentStatus"
            value="abnormal"
            checked={form.assessmentStatus === "abnormal"}
            onChange={e => updateField("assessmentStatus", "abnormal")}
            style={{marginLeft: 16}}
          />
          Abnormal
        </label>
      </section>

      {form.assessmentStatus === "abnormal" && (
        <section style={{marginTop: 20, marginBottom: 20, border: "1px solid #eee", borderRadius: 8, padding: 12}}>
          <h3>Annotate Areas of Concern</h3>
          <div style={{display: "flex", gap: 16, flexWrap: "wrap"}}>
            <div>
              <div style={{textAlign: "center"}}><strong>Front</strong></div>
              <BodyDiagram
                side="front"
                markedAreas={form.abnormalAreas.front}
                onMark={id => handleAreaMark("front", id)}
              />
            </div>
            <div>
              <div style={{textAlign: "center"}}><strong>Back</strong></div>
              <BodyDiagram
                side="back"
                markedAreas={form.abnormalAreas.back}
                onMark={id => handleAreaMark("back", id)}
              />
            </div>
          </div>
        </section>
      )}

      <section style={{marginTop: 20}}>
        <h3>Skin Sheet Notes</h3>
        <label>
          Name:
          <input
            type="text"
            value={form.skinSheet.name}
            onChange={e => updateField("skinSheet.name", e.target.value)}
            style={{marginLeft: 8}}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={form.skinSheet.age}
            onChange={e => updateField("skinSheet.age", e.target.value)}
            style={{marginLeft: 8, width: 60}}
          />
        </label>
        <br />
        <label>
          Attending Physician:
          <input
            type="text"
            value={form.skinSheet.physician}
            onChange={e => updateField("skinSheet.physician", e.target.value)}
            style={{marginLeft: 8}}
          />
        </label>
        <br />
        <label>
          Room:
          <input
            type="text"
            value={form.skinSheet.room}
            onChange={e => updateField("skinSheet.room", e.target.value)}
            style={{marginLeft: 8}}
          />
        </label>
      </section>

      <section style={{marginTop: 20}}>
        <h4>Observations</h4>
        <table style={{width: "100%", borderCollapse: "collapse"}}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Remarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.skinSheet.observations.map((obs, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="date"
                    value={obs.date}
                    onChange={e => updateObservation(idx, "date", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={obs.time}
                    onChange={e => updateObservation(idx, "time", e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    value={obs.remarks}
                    rows={2}
                    style={{width: "90%"}}
                    onChange={e => updateObservation(idx, "remarks", e.target.value)}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeObservation(idx)} style={{color: "red", fontWeight: "bold"}}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addObservation} style={{marginTop: 10}}>Add Observation</button>
      </section>

      <div style={{marginTop: 40, display: "flex", justifyContent: "space-between"}}>
        <button type="button" onClick={handlePrint}>Print Form</button>
        <span style={{fontSize: 12, color: "#aaa"}}>Auto-saved</span>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .skin-assessment-form, .skin-assessment-form * {
            visibility: visible !important;
          }
          .skin-assessment-form {
            position: absolute !important;
            left: 0; top: 0;
            width: 100vw;
            margin: 0 !important;
            box-shadow: none !important;
            background: #fff !important;
            padding: 0 !important;
          }
          button, input[type="button"] {
            display: none !important;
          }
        }
        /* Mobile-friendly styles */
        .skin-assessment-form input,
        .skin-assessment-form textarea {
          font-size: 1em;
          width: 92%;
          max-width: 320px;
          margin-bottom: 4px;
        }
        .skin-assessment-form table input,
        .skin-assessment-form table textarea {
          width: 100%;
        }
        @media (max-width: 700px) {
          .skin-assessment-form {
            max-width: 98vw !important;
            padding: 3vw;
          }
          .skin-assessment-form section {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
