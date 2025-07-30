import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SuperAdminSidebar } from "@/components/ui/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/ui/super-admin-header"

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  console.log('SuperAdminLayout rendering with children:', !!children)
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <SuperAdminSidebar />
        <SidebarInset className="flex-1">
          <SuperAdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}