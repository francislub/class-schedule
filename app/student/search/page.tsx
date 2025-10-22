"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Phone, BookOpen, Calendar, Search } from "lucide-react"
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
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Courses</h1>
            <p className="text-muted-foreground">Find course schedules by code or name</p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter course code or name (e.g., CS101 or Programming)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">Searching courses...</p>
              </CardContent>
            </Card>
          ) : searched && courses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try searching with a different course code or name</p>
                </div>
              </CardContent>
            </Card>
          ) : courses.length > 0 ? (
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
                          {course.yearOfStudy && <Badge>Year {course.yearOfStudy}</Badge>}
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
          ) : null}
        </div>
      </main>
    </div>
  )
}
