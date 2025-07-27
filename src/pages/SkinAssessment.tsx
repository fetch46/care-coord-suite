import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"

export function SkinAssessmentForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    assessorName: "",
    observations: Array(10).fill({ area: "", condition: "", notes: "" }),
  })

  const handleObservationChange = (index: number, field: string, value: string) => {
    const updated = [...formData.observations]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, observations: updated })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  useEffect(() => {
    const saved = localStorage.getItem("skinAssessmentForm")
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("skinAssessmentForm", JSON.stringify(formData))
  }, [formData])

  const handlePrint = () => window.print()

  return (
    <div className="space-y-6 px-4 py-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Skin Assessment Form</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input name="patientName" value={formData.patientName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="assessorName">Assessor Name</Label>
            <Input name="assessorName" value={formData.assessorName} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      <Card className="print:break-before-page">
        <CardHeader>
          <CardTitle>Body Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-center">
            <svg viewBox="0 0 200 400" className="w-72 h-auto">
              <circle cx="100" cy="50" r="20" fill="#fbbf24" />
              <rect x="80" y="70" width="40" height="100" fill="#f59e0b" />
              <line x1="80" y1="70" x2="60" y2="150" stroke="#b45309" strokeWidth="5" />
              <line x1="120" y1="70" x2="140" y2="150" stroke="#b45309" strokeWidth="5" />
              <line x1="90" y1="170" x2="90" y2="250" stroke="#b45309" strokeWidth="5" />
              <line x1="110" y1="170" x2="110" y2="250" stroke="#b45309" strokeWidth="5" />
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card className="print:break-before-page">
        <CardHeader>
          <CardTitle>Skin Observations</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Area</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.observations.map((obs, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      placeholder="e.g. Elbow"
                      value={obs.area}
                      onChange={(e) => handleObservationChange(index, "area", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="e.g. Rash"
                      value={obs.condition}
                      onChange={(e) => handleObservationChange(index, "condition", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Additional notes"
                      value={obs.notes}
                      onChange={(e) => handleObservationChange(index, "notes", e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center print:hidden">
        <span className="text-muted-foreground text-sm">
          Form is saved automatically.
        </span>
        <Button variant="outline" onClick={handlePrint}>Print</Button>
      </div>
    </div>
  )
}
