import { HODSidebar } from "@/components/hod-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, MapPin, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

async function getHODData() {
  const cookieStore = await cookies()
  const session = cookieStore.get("hod-session")

  if (!session) {
    return null
  }

  const { email, departmentId } = JSON.parse(session.value)

  const [hod, courseCount] = await Promise.all([
    prisma.hOD.findFirst({
      where: { email, departmentId },
      include: { department: true },
    }),
    prisma.courseUnit.count({
      where: { departmentId },
    }),
  ])

  return { hod, courseCount }
}

export default async function HODDashboardPage() {
  const data = await getHODData()

  if (!data) {
    return <div>Unauthorized</div>
  }

  const { hod, courseCount } = data

  return (
    <div className="flex min-h-screen">
      <HODSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {hod?.name} - {hod?.department.name}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Course Units</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{courseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Total courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hod?.department.code}</div>
                <p className="text-xs text-muted-foreground mt-1">{hod?.department.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{courseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">With schedules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Venues</CardTitle>
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{courseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Assigned venues</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/hod/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <BookOpen className="w-8 h-8 text-secondary mb-2" />
                  <h3 className="font-semibold mb-1">Manage Course Units</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove course units</p>
                </a>
                <a href="/hod/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Clock className="w-8 h-8 text-accent mb-2" />
                  <h3 className="font-semibold mb-1">Schedule Classes</h3>
                  <p className="text-sm text-muted-foreground">Set times and venues for courses</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
