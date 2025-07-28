// Index.tsx
import { Users, Calendar, Activity, Heart, UserCheck, ClipboardList, TrendingUp } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { FinancesStats } from "@/components/dashboard/finances-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton" // <-- new
import heroImage from "@/assets/healthcare-hero.jpg"

// Optional Recharts (remove <ResponsiveContainer> + <BarChart> if you don’t want charts)
import { BarChart, Bar, ResponsiveContainer } from "recharts"

const statusData = [
  { name: "Critical", count: 12 },
  { name: "Stable", count: 89 },
  { name: "Recovery", count: 45 },
  { name: "Outpatient", count: 234 },
]

// Re-usable progress bar
const MetricProgress = ({ label, value, percent, colorClass }: {
  label: string
  value: string | number
  percent: string
  colorClass: string
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`${colorClass} h-full`} style={{ width: percent }} />
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
)

const Index = () => {
  const isLoading = false // <-- flip to true to see skeletons

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-6 space-y-6 w-full">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="h-48 bg-gradient-to-r from-primary/90 to-healthcare-teal/80 flex items-center justify-between p-8 text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--healthcare-teal) / 0.8)), url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "hsl(var(--primary))", // fallback
                }}
              >
                <div className="z-10">
                  <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Andrew</h1>
                  <p className="text-lg opacity-90">America Care Team • Administrator Dashboard</p>
                  <p className="text-sm opacity-75 mt-2">Today is a great day to provide exceptional care</p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm">
                  <Heart className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              <StatsCard
                title="Total Patients"
                value={isLoading ? <Skeleton className="h-8 w-14" /> : "847"}
                icon={Users}
                variant="primary"
                change={{ value: "+12%", trend: "up" }}
              />
              <StatsCard
                title="Active Staff"
                value={isLoading ? <Skeleton className="h-8 w-14" /> : "156"}
                icon={UserCheck}
                variant="teal"
                change={{ value: "+3%", trend: "up" }}
              />
              <StatsCard
                title="Today's Appointments"
                value={isLoading ? <Skeleton className="h-8 w-14" /> : "24"}
                icon={Calendar}
                variant="coral"
                change={{ value: "-2%", trend: "down" }}
              />
              <StatsCard
                title="Assessments Pending"
                value={isLoading ? <Skeleton className="h-8 w-14" /> : "8"}
                icon={ClipboardList}
                variant="default"
                change={{ value: "+1", trend: "up" }}
              />
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>


            {/* Additional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {/* Patient Status Overview */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Patient Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={statusData}>
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <MetricProgress label="Critical Care" value={12} percent="25%" colorClass="bg-destructive" />
                  <MetricProgress label="Stable" value={89} percent="75%" colorClass="bg-healthcare-success" />
                  <MetricProgress label="Recovery" value={45} percent="50%" colorClass="bg-healthcare-teal" />
                  <MetricProgress label="Outpatient" value={234} percent="100%" colorClass="bg-healthcare-coral" />
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetricProgress label="Patient Satisfaction" value="94%" percent="94%" colorClass="bg-healthcare-success" />
                  <MetricProgress label="Staff Efficiency" value="87%" percent="87%" colorClass="bg-primary" />
                  <MetricProgress label="Response Time" value="8.2 min" percent="75%" colorClass="bg-healthcare-teal" />
                  <MetricProgress label="Assessment Completion" value="91%" percent="91%" colorClass="bg-healthcare-coral" />
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Index
