import { Users, Calendar, CheckCircle, Clock } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export function CaregiverDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assignedPatients: 0,
    todaysAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    if (!user) return

    try {
      // Get caregiver ID from staff table
      const { data: staffData } = await supabase
        .from('staff')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!staffData) {
        console.error('Staff record not found for user')
        return
      }

      const caregiverId = staffData.id

      // Fetch assigned patients
      const { count: assignedPatients } = await supabase
        .from('patient_caregivers')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', caregiverId)

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0]
      const { count: todaysAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', caregiverId)
        .gte('appointment_date', `${today}T00:00:00`)
        .lt('appointment_date', `${today}T23:59:59`)

      // Fetch completed appointments (this month)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: completedAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', caregiverId)
        .eq('status', 'completed')
        .gte('appointment_date', startOfMonth)

      // Fetch pending appointments
      const { count: pendingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('caregiver_id', caregiverId)
        .eq('status', 'scheduled')

      setStats({
        assignedPatients: assignedPatients || 0,
        todaysAppointments: todaysAppointments || 0,
        completedAppointments: completedAppointments || 0,
        pendingAppointments: pendingAppointments || 0
      })
    } catch (error) {
      console.error('Error fetching caregiver dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Patients Assigned"
          value={loading ? "..." : stats.assignedPatients.toString()}
          icon={Users}
          variant="primary"
          change={{ value: "+2", trend: "up" }}
        />
        <StatsCard
          title="Today's Appointments"
          value={loading ? "..." : stats.todaysAppointments.toString()}
          icon={Calendar}
          variant="teal"
          change={{ value: "0", trend: "neutral" }}
        />
        <StatsCard
          title="Completed This Month"
          value={loading ? "..." : stats.completedAppointments.toString()}
          icon={CheckCircle}
          variant="coral"
          change={{ value: "+15%", trend: "up" }}
        />
        <StatsCard
          title="Pending Appointments"
          value={loading ? "..." : stats.pendingAppointments.toString()}
          icon={Clock}
          variant="default"
          change={{ value: "+3", trend: "up" }}
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-6">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
    </>
  )
}