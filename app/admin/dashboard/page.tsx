import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardContent />
      <Footer />
    </div>
  )
}
