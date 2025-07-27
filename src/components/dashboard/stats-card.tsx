import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: string
    trend: "up" | "down" | "neutral"
  }
  variant?: "default" | "primary" | "teal" | "coral"
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  variant = "default",
  className 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "border-primary/20 bg-primary/5"
      case "teal":
        return "border-healthcare-teal/20 bg-healthcare-teal/5"
      case "coral":
        return "border-healthcare-coral/20 bg-healthcare-coral/5"
      default:
        return "border-border bg-muted/10"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "primary":
        return "text-primary"
      case "teal":
        return "text-healthcare-teal"
      case "coral":
        return "text-healthcare-coral"
      default:
        return "text-muted-foreground"
    }
  }

  const getTrendColor = () => {
    switch (change?.trend) {
      case "up":
        return "text-healthcare-success"
      case "down":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={cn(
      "w-full shadow-sm hover:shadow-md transition-all",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center",
          getIconStyles()
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-semibold text-foreground">
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <span className={cn("text-xs font-medium", getTrendColor())}>
              {change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "→"} {change.value}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
