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
        title: "Schedule",
        description: "Book patient appointment",
        icon: Calendar,
        variant: "teal",
        action: () => console.log("Schedule appointment"),
      },
      {
        title: "Assessment",
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
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant={variantMap[action.variant]}
            className="h-24 p-4 flex flex-col items-start justify-between text-left"
            onClick={action.action}
          >
            <div className="flex items-center gap-2 w-full">
              <action.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base line-clamp-1">
                {action.title}
              </span>
            </div>
            <span className="text-xs text-muted-foreground line-clamp-2 text-ellipsis w-full">
              {action.description}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
