import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Crown, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function SuperAdminHeader() {
  const navigate = useNavigate()

  const handleBackToMain = () => {
    navigate('/dashboard')
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 flex-1">
        <Crown className="w-5 h-5 text-purple-600" />
        <span className="text-lg font-semibold">Super Admin Portal</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBackToMain}
        className="ml-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Main App
      </Button>
    </header>
  )
}