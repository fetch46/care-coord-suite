import { Users, Calendar, Activity, Heart, UserCheck, ClipboardList, TrendingUp } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import heroImage from "@/assets/healthcare-hero.jpg"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 w-full">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                className="h-48 bg-gradient-to-r from-primary/90 to-healthcare-teal/80 flex items-center justify-between p-8 text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--healthcare-teal) / 0.8)), url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
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
                value="847"
                icon={Users}
                variant="primary"
                change={{ value: "+12%", trend: "up" }}
              />
              <StatsCard
                title="Active Staff"
                value="156"
                icon={UserCheck}
                variant="teal"
                change={{ value: "+3%", trend: "up" }}
              />
              <StatsCard
                title="Today's Appointments"
                value="24"
                icon={Calendar}
                variant="coral"
                change={{ value: "-2%", trend: "down" }}
              />
              <StatsCard
                title="Assessments Pending"
                value="8"
                icon={ClipboardList}
                variant="default"
                change={{ value: "+1", trend: "up" }}
              />
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>

              {/* Recent Activity */}
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Critical Care</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/4 h-full bg-destructive"></div>
                      </div>
                      <span className="text-sm font-medium">12</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stable</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-healthcare-success"></div>
                      </div>
                      <span className="text-sm font-medium">89</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Recovery</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-healthcare-teal"></div>
                      </div>
                      <span className="text-sm font-medium">45</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Outpatient</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-full h-full bg-healthcare-coral"></div>
                      </div>
                      <span className="text-sm font-medium">234</span>
                    </div>
                  </div>
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-5/6 h-full bg-healthcare-success"></div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Staff Efficiency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-primary"></div>
                      </div>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-healthcare-teal"></div>
                      </div>
                      <span className="text-sm font-medium">8.2 min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assessment Completion</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-healthcare-coral"></div>
                      </div>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
