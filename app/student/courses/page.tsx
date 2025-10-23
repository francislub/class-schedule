import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Phone, BookOpen, GraduationCap } from "lucide-react"
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
    },
    orderBy: [{ yearOfStudy: "asc" }, { semester: "asc" }, { code: "asc" }],
  })

  return { student, courses }
}

export default async function StudentCoursesPage() {
  const data = await getStudentCourses()

  if (!data) {
    return <div>Unauthorized</div>
  }

  const { student, courses } = data

  const coursesByYear = courses.reduce(
    (acc, course) => {
      const year = course.yearOfStudy || 0
      if (!acc[year]) acc[year] = []
      acc[year].push(course)
      return acc
    },
    {} as Record<number, typeof courses>,
  )

  const cardColors = [
    "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    "from-purple-500/10 to-purple-600/10 border-purple-500/20",
    "from-green-500/10 to-green-600/10 border-green-500/20",
    "from-orange-500/10 to-orange-600/10 border-orange-500/20",
    "from-teal-500/10 to-teal-600/10 border-teal-500/20",
    "from-pink-500/10 to-pink-600/10 border-pink-500/20",
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-4xl font-bold mb-2">All Department Courses</h1>
            <p className="text-blue-100 text-lg">
              {student?.department.name} - {courses.length} courses available
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Your Year: {student?.yearOfStudy}</span>
            </div>
          </div>

          {courses.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses available</h3>
                  <p className="text-muted-foreground">
                    There are no courses registered for this department yet. Please check back later.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(coursesByYear)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([year, yearCourses]) => (
                  <div key={year}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full font-bold">
                        Year {year || "Unspecified"}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                      <Badge variant="secondary" className="text-sm">
                        {yearCourses.length} courses
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {yearCourses.map((course, index) => (
                        <Card
                          key={course.id}
                          className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 bg-gradient-to-br ${cardColors[index % cardColors.length]}`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2 text-balance">{course.name}</CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge className="bg-blue-600 hover:bg-blue-700">{course.code}</Badge>
                                  <Badge variant="outline" className="border-blue-600 text-blue-700">
                                    {course.credits} Credits
                                  </Badge>
                                  {course.semester && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                      Sem {course.semester}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {course.description && (
                              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{course.description}</p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {course.lecturer && (
                              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                                <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground">Lecturer</p>
                                  <p className="text-sm font-semibold text-foreground">{course.lecturer}</p>
                                </div>
                              </div>
                            )}

                            {course.lecturerContact && (
                              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                                <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground">Contact</p>
                                  <p className="text-sm font-semibold text-foreground">{course.lecturerContact}</p>
                                </div>
                              </div>
                            )}

                            {course.venue && (
                              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                                <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground">Venue</p>
                                  <p className="text-sm font-semibold text-foreground">{course.venue}</p>
                                </div>
                              </div>
                            )}

                            {course.dayOfWeek && course.startTime && course.endTime && (
                              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                                <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground">Schedule</p>
                                  <p className="text-sm font-semibold text-foreground">
                                    {course.dayOfWeek}, {course.startTime} - {course.endTime}
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
