import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, BookOpen, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getStats() {
  const [departmentCount, hodCount, courseCount] = await Promise.all([
    prisma.department.count(),
    prisma.hOD.count(),
    prisma.courseUnit.count(),
  ])

  return { departmentCount, hodCount, courseCount }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Bugema University admin portal</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Departments</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.departmentCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Active departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total HODs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.hodCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered HODs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Course Units</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.courseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Total courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/departments" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Building2 className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Manage Departments</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove departments</p>
                </a>
                <a href="/admin/hods" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Users className="w-8 h-8 text-secondary mb-2" />
                  <h3 className="font-semibold mb-1">Manage HODs</h3>
                  <p className="text-sm text-muted-foreground">Register and manage HODs</p>
                </a>
                <a href="/admin/departments" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <BookOpen className="w-8 h-8 text-accent mb-2" />
                  <h3 className="font-semibold mb-1">View Reports</h3>
                  <p className="text-sm text-muted-foreground">Access system reports and analytics</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
