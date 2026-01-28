import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SuperAdminSidebar } from "@/components/ui/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/ui/super-admin-header"

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-purple-50/30">
        <SuperAdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <SuperAdminHeader />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}