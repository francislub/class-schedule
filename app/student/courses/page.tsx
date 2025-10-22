import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Phone, BookOpen, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

async function getStudentCourses() {
  const cookieStore = await cookies()
  const session = cookieStore.get("student-session")

  if (!session) {
    return null
  }

  const { studentId, departmentId } = JSON.parse(session.value)

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { department: true },
  })

  const courses = await prisma.courseUnit.findMany({
    where: {
      departmentId,
      yearOfStudy: student?.yearOfStudy,
    },
    orderBy: { code: "asc" },
  })

  return { student, courses }
}

export default async function StudentCoursesPage() {
  const data = await getStudentCourses()

  if (!data) {
    return <div>Unauthorized</div>
  }

  const { student, courses } = data

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Courses for Year {student?.yearOfStudy} - {student?.department.name}
            </p>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses available</h3>
                  <p className="text-muted-foreground">
                    There are no courses registered for your year yet. Please check back later.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{course.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{course.code}</Badge>
                          <Badge variant="outline">{course.credits} Credits</Badge>
                        </div>
                      </div>
                    </div>
                    {course.description && <p className="text-sm text-muted-foreground mt-2">{course.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.lecturer && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Lecturer</p>
                          <p className="text-sm text-muted-foreground">{course.lecturer}</p>
                        </div>
                      </div>
                    )}

                    {course.lecturerContact && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-sm text-muted-foreground">{course.lecturerContact}</p>
                        </div>
                      </div>
                    )}

                    {course.venue && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Venue</p>
                          <p className="text-sm text-muted-foreground">{course.venue}</p>
                        </div>
                      </div>
                    )}

                    {course.dayOfWeek && course.startTime && course.endTime && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Schedule</p>
                          <p className="text-sm text-muted-foreground">
                            {course.dayOfWeek}, {course.startTime} - {course.endTime}
                          </p>
                        </div>
                      </div>
                    )}

                    {course.semester && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Semester</p>
                          <p className="text-sm text-muted-foreground">{course.semester}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
