"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Phone, BookOpen, Search, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CourseUnit {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  lecturer: string | null
  lecturerContact: string | null
  venue: string | null
  dayOfWeek: string | null
  startTime: string | null
  endTime: string | null
  semester: string | null
  yearOfStudy: number | null
}

const cardColors = [
  "from-blue-500/10 to-blue-600/10 border-blue-500/30",
  "from-purple-500/10 to-purple-600/10 border-purple-500/30",
  "from-green-500/10 to-green-600/10 border-green-500/30",
  "from-orange-500/10 to-orange-600/10 border-orange-500/30",
  "from-teal-500/10 to-teal-600/10 border-teal-500/30",
  "from-pink-500/10 to-pink-600/10 border-pink-500/30",
]

export default function StudentSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<CourseUnit[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search term",
        description: "Please enter a course code or name to search",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/student/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Search Courses</h1>
            </div>
            <p className="text-purple-100 text-lg">Find course schedules by code or name</p>
          </div>

          <Card className="mb-8 shadow-xl border-2">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-500" />
                  <Input
                    placeholder="Enter course code or name (e.g., CS101 or Programming)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 h-14 text-lg border-2 focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-semibold text-lg hover:scale-105"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card className="border-2">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Searching courses...</p>
                </div>
              </CardContent>
            </Card>
          ) : searched && courses.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-16">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try searching with a different course code or name</p>
                </div>
              </CardContent>
            </Card>
          ) : courses.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Found {courses.length} course{courses.length !== 1 ? "s" : ""}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <Card
                    key={course.id}
                    className={`hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 bg-gradient-to-br ${cardColors[index % cardColors.length]}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 text-balance">{course.name}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-white">{course.code}</Badge>
                            <Badge variant="outline" className="border-purple-600 text-purple-700">
                              {course.credits} Credits
                            </Badge>
                            {course.yearOfStudy && (
                              <Badge className="bg-pink-600 hover:bg-pink-700 text-white">
                                Year {course.yearOfStudy}
                              </Badge>
                            )}
                            {course.semester && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
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
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                          <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Lecturer</p>
                            <p className="text-sm font-semibold text-foreground">{course.lecturer}</p>
                          </div>
                        </div>
                      )}

                      {course.lecturerContact && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                          <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Contact</p>
                            <p className="text-sm font-semibold text-foreground">{course.lecturerContact}</p>
                          </div>
                        </div>
                      )}

                      {course.venue && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                          <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Venue</p>
                            <p className="text-sm font-semibold text-foreground">{course.venue}</p>
                          </div>
                        </div>
                      )}

                      {course.dayOfWeek && course.startTime && course.endTime && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
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
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
