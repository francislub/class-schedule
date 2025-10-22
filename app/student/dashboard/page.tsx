import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, User } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

async function getStudentData() {
  const cookieStore = await cookies()
  const session = cookieStore.get("student-session")

  if (!session) {
    return null
  }

  const { studentId, departmentId } = JSON.parse(session.value)

  const [student, courseCount] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: { department: true },
    }),
    prisma.courseUnit.count({
      where: { departmentId },
    }),
  ])

  return { student, courseCount }
}

export default async function StudentDashboardPage() {
  const data = await getStudentData()

  if (!data) {
    return <div>Unauthorized</div>
  }

  const { student, courseCount } = data

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {student?.name}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Student Number</CardTitle>
                <User className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student?.studentNumber}</div>
                <p className="text-xs text-muted-foreground mt-1">Your ID</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{student?.department.code}</div>
                <p className="text-xs text-muted-foreground mt-1">{student?.department.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Year of Study</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Year {student?.yearOfStudy}</div>
                <p className="text-xs text-muted-foreground mt-1">Current year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Courses</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{courseCount}</div>
                <p className="text-xs text-muted-foreground mt-1">In your department</p>
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
                <a href="/student/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <BookOpen className="w-8 h-8 text-accent mb-2" />
                  <h3 className="font-semibold mb-1">View My Courses</h3>
                  <p className="text-sm text-muted-foreground">See all courses for your year</p>
                </a>
                <a href="/student/search" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Search Courses</h3>
                  <p className="text-sm text-muted-foreground">Find specific course schedules</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
