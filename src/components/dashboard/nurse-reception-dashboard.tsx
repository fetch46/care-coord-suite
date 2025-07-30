import { Users, Calendar, Clock, ClipboardList } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export function NurseReceptionDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    todaysAppointments: 0,
    pendingAppointments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })

      // Fetch active patients
      const { count: activePatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active')

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0]
      const { count: todaysAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', `${today}T00:00:00`)
        .lt('appointment_date', `${today}T23:59:59`)

      // Fetch pending appointments
      const { count: pendingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled')

      setStats({
        totalPatients: totalPatients || 0,
        activePatients: activePatients || 0,
        todaysAppointments: todaysAppointments || 0,
        pendingAppointments: pendingAppointments || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value={loading ? "..." : stats.totalPatients.toString()}
          icon={Users}
          variant="primary"
          change={{ value: "+12%", trend: "up" }}
        />
        <StatsCard
          title="Active Patients"
          value={loading ? "..." : stats.activePatients.toString()}
          icon={Users}
          variant="teal"
          change={{ value: "+5%", trend: "up" }}
        />
        <StatsCard
          title="Today's Appointments"
          value={loading ? "..." : stats.todaysAppointments.toString()}
          icon={Calendar}
          variant="coral"
          change={{ value: "-2%", trend: "down" }}
        />
        <StatsCard
          title="Pending Appointments"
          value={loading ? "..." : stats.pendingAppointments.toString()}
          icon={ClipboardList}
          variant="default"
          change={{ value: "+1", trend: "up" }}
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </>
  )
}