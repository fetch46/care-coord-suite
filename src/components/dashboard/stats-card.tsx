import { DivideIcon as LucideIcon } from "lucide-react"
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
        return "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
      case "teal":
        return "border-healthcare-teal/20 bg-gradient-to-br from-healthcare-teal/5 to-healthcare-teal/10"
      case "coral":
        return "border-healthcare-coral/20 bg-gradient-to-br from-healthcare-coral/5 to-healthcare-coral/10"
      default:
        return "border-border"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary text-white"
      case "teal":
        return "bg-gradient-teal text-white"
      case "coral":
        return "bg-gradient-coral text-white"
      default:
        return "bg-muted text-muted-foreground"
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
      "w-full shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          getIconStyles()
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {change.trend === "up" ? "↗" : change.trend === "down" ? "↘" : "→"} {change.value}
            </span>
            <span className="text-sm text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}