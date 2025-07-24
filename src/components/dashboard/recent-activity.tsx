import { Clock, User, Calendar, FileText, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    type: "patient_admission",
    icon: User,
    title: "New Patient Admission",
    description: "Jane Doe admitted to Room 204",
    time: "2 minutes ago",
    status: "active"
  },
  {
    id: 2,
    type: "assessment_completed",
    icon: FileText,
    title: "Assessment Completed",
    description: "Post-op evaluation for John Smith",
    time: "15 minutes ago",
    status: "completed"
  },
  {
    id: 3,
    type: "staff_assigned",
    icon: UserCheck,
    title: "Staff Assignment",
    description: "Nurse Maria assigned to Room 105",
    time: "32 minutes ago",
    status: "assigned"
  },
  {
    id: 4,
    type: "appointment_scheduled",
    icon: Calendar,
    title: "Appointment Scheduled",
    description: "Follow-up with Dr. Wilson",
    time: "1 hour ago",
    status: "scheduled"
  },
  {
    id: 5,
    type: "medication_updated",
    icon: FileText,
    title: "Medication Updated",
    description: "Prescription modified for Room 201",
    time: "2 hours ago",
    status: "updated"
  }
]

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-healthcare-success/10 text-healthcare-success border-healthcare-success/20"
      case "completed":
        return "bg-primary/10 text-primary border-primary/20"
      case "assigned":
        return "bg-healthcare-teal/10 text-healthcare-teal border-healthcare-teal/20"
      case "scheduled":
        return "bg-healthcare-coral/10 text-healthcare-coral border-healthcare-coral/20"
      case "updated":
        return "bg-healthcare-warning/10 text-healthcare-warning border-healthcare-warning/20"
      default:
        return "bg-muted/10 text-muted-foreground border-border"
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <activity.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                <Badge variant="outline" className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}