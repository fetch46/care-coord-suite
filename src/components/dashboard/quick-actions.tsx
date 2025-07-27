import { Plus, Calendar, UserPlus, ClipboardList, FileText, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

type QuickAction = {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "primary" | "teal" | "coral" | "default";
  action: () => void;
};

const variantMap = {
  primary: "default",
  teal: "secondary",
  coral: "outline",
  default: "outline",
} as const;

const iconSize = "w-5 h-5";

export function QuickActions() {
  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        title: "New Patient",
        description: "Register a new patient",
        icon: UserPlus,
        variant: "primary",
        action: () => console.log("New patient"),
      },
      {
        title: "Schedule Appointment",
        description: "Book patient appointment",
        icon: Calendar,
        variant: "teal",
        action: () => console.log("Schedule appointment"),
      },
      {
        title: "Start Assessment",
        description: "Begin patient evaluation",
        icon: ClipboardList,
        variant: "coral",
        action: () => console.log("Start assessment"),
      },
      {
        title: "Generate Report",
        description: "Create care report",
        icon: FileText,
        variant: "default",
        action: () => console.log("Generate report"),
      },
    ],
    []
  );

  return (
    <Card className="w-full shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className={iconSize} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant={variantMap[action.variant]}
            className="h-auto p-4 flex flex-col items-start gap-2 text-left hover:bg-opacity-90 transition-colors"
            onClick={action.action}
            aria-label={action.title}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className={`${iconSize} flex-shrink-0`} />
              <span className="font-medium">{action.title}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {action.description}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
