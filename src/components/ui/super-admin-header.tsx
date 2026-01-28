import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { 
  Crown, 
  ArrowLeft, 
  Bell, 
  Search,
  ChevronRight
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Breadcrumb configuration
const routeLabels: Record<string, string> = {
  '/super-admin': 'Dashboard',
  '/super-admin/organizations': 'Organizations',
  '/super-admin/organization-signups': 'Organization Signups',
  '/super-admin/packages': 'Packages',
  '/super-admin/subscriptions': 'Subscriptions',
  '/super-admin/users': 'User Management',
  '/super-admin/settings': 'System Settings',
  '/super-admin/security': 'Security & Permissions',
  '/super-admin/communication': 'Communication',
  '/super-admin/cms': 'Content Management',
}

export function SuperAdminHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBackToMain = () => {
    navigate('/dashboard')
  }

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)
    const breadcrumbs: { label: string; path: string }[] = []
    
    let currentPath = ''
    for (const segment of segments) {
      currentPath += `/${segment}`
      const label = routeLabels[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      breadcrumbs.push({ label, path: currentPath })
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-gradient-to-r from-background to-muted/30 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1 hover:bg-purple-100 hover:text-purple-700 transition-colors" />
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50">
          <Crown className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-700">Admin</span>
        </div>
        {breadcrumbs.slice(1).map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <button 
              onClick={() => navigate(crumb.path)}
              className={`px-2 py-1 rounded-md transition-colors ${
                index === breadcrumbs.length - 2 
                  ? 'font-medium text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {crumb.label}
            </button>
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search organizations, users..." 
          className="w-64 pl-9 bg-muted/50 border-muted focus:bg-background transition-colors"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative hover:bg-purple-100 hover:text-purple-700">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600 text-[10px]">
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-popover">
          <div className="p-3 border-b">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-xs text-muted-foreground">System alerts and updates</p>
          </div>
          <DropdownMenuItem className="p-3 cursor-pointer">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">New organization signup</span>
              <span className="text-xs text-muted-foreground">HealthCare Plus registered 2 hours ago</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-3 cursor-pointer">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Subscription expiring</span>
              <span className="text-xs text-muted-foreground">MedCorp's trial ends in 3 days</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-3 cursor-pointer">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">System update available</span>
              <span className="text-xs text-muted-foreground">Version 2.1.0 is ready to deploy</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Back to Main App */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBackToMain}
        className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Main App
      </Button>
    </header>
  )
}
