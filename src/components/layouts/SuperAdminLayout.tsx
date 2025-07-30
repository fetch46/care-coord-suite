import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SuperAdminSidebar } from "@/components/ui/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/ui/super-admin-header"

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <SuperAdminSidebar />
        <SidebarInset>
          <SuperAdminHeader />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}