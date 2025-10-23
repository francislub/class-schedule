"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, User, Clock, Award, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const CARD_COLORS = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30",
  green: "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30",
  teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30",
  pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30",
  indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30",
  rose: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30",
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"]

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/student/stats")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("[v0] Error fetching student data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 rounded-2xl p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold mb-2">Welcome Back, {data.student?.name}! 👋</h1>
            <p className="text-blue-100 text-lg">Here's your academic overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={`${CARD_COLORS.blue} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Student Number</CardTitle>
                <User className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.student?.studentNumber}</div>
                <p className="text-xs text-white/80 mt-1">Your ID</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.green} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Department</CardTitle>
                <GraduationCap className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.student?.department.code}</div>
                <p className="text-xs text-white/80 mt-1">{data.student?.department.name}</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.purple} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Year of Study</CardTitle>
                <Calendar className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">Year {data.student?.yearOfStudy}</div>
                <p className="text-xs text-white/80 mt-1">Current year</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.orange} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">My Courses</CardTitle>
                <BookOpen className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.myCourseCount || 0}</div>
                <p className="text-xs text-white/80 mt-1">For your year</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.teal} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Total Credits</CardTitle>
                <Award className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.totalCredits || 0}</div>
                <p className="text-xs text-white/80 mt-1">Credit units</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.pink} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Scheduled Classes</CardTitle>
                <Clock className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.scheduledCount || 0}</div>
                <p className="text-xs text-white/80 mt-1">With time & venue</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.indigo} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">All Dept Courses</CardTitle>
                <TrendingUp className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.totalDeptCourses || 0}</div>
                <p className="text-xs text-white/80 mt-1">In department</p>
              </CardContent>
            </Card>

            <Card className={`${CARD_COLORS.rose} border-0 hover:scale-105 transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Avg Credits</CardTitle>
                <Award className="w-5 h-5 text-white/90" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.avgCredits || 0}</div>
                <p className="text-xs text-white/80 mt-1">Per course</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                <CardTitle className="text-xl">My Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    classes: {
                      label: "Classes",
                      color: "#3b82f6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weeklySchedule || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="classes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-xl">Courses by Semester</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    courses: {
                      label: "Courses",
                      color: "#10b981",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.semesterStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semester" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-xl">Semester Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    semester: {
                      label: "Semester",
                      color: "#8b5cf6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.semesterStats || []}
                        dataKey="count"
                        nameKey="semester"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {(data.semesterStats || []).map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="text-xl">Credit Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    credits: {
                      label: "Credits",
                      color: "#f59e0b",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.creditStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="credits" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/student/courses"
                  className="p-6 border-2 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:scale-105"
                >
                  <BookOpen className="w-10 h-10 text-orange-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2 text-orange-900">View All Courses</h3>
                  <p className="text-sm text-orange-700">Browse all department courses</p>
                </a>
                <a
                  href="/student/search"
                  className="p-6 border-2 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:scale-105"
                >
                  <Calendar className="w-10 h-10 text-blue-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2 text-blue-900">Search Courses</h3>
                  <p className="text-sm text-blue-700">Find specific course schedules</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
