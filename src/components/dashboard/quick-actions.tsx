import { Plus, Calendar, UserPlus, ClipboardList, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const quickActions = [
  {
    title: "New Patient",
    description: "Register a new patient",
    icon: UserPlus,
    variant: "primary" as const,
    action: () => console.log("New patient")
  },
  {
    title: "Schedule Appointment",
    description: "Book patient appointment",
    icon: Calendar,
    variant: "teal" as const,
    action: () => console.log("Schedule appointment")
  },
  {
    title: "Start Assessment",
    description: "Begin patient evaluation",
    icon: ClipboardList,
    variant: "coral" as const,
    action: () => console.log("Start assessment")
  },
  {
    title: "Generate Report",
    description: "Create care report",
    icon: FileText,
    variant: "default" as const,
    action: () => console.log("Generate report")
  }
]

export function QuickActions() {
  return (
    <Card className="w-full shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const getButtonVariant = () => {
            switch (action.variant) {
              case "primary":
                return "default"
              case "teal":
                return "secondary"
              case "coral":
                return "outline"
              default:
                return "outline"
            }
          }

          return (
            <Button
              key={action.title}
              variant={getButtonVariant()}
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
              onClick={action.action}
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {action.description}
              </span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}