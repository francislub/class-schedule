"use client"

import { HODSidebar } from "@/components/hod-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, MapPin, Users, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const CARD_COLORS = {
  blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200",
  green: "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200",
  purple: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200",
  orange: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200",
  teal: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200",
  pink: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-200",
}

export default function HODDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/hod/stats")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("[v0] Error fetching HOD data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex min-h-screen">
      <HODSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8 bg-gradient-to-br from-background via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {data.hod?.name} - {data.hod?.department.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className={CARD_COLORS.blue}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Course Units</CardTitle>
                <BookOpen className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{data.courseCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Total courses</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.green}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
                <Users className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.hod?.department.code}</div>
                <p className="text-xs text-muted-foreground mt-1">{data.hod?.department.name}</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.purple}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Clock className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">{data.scheduledCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">With schedules</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.orange}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Venues Assigned</CardTitle>
                <MapPin className="w-5 h-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{data.venueCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Assigned venues</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.teal}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="w-5 h-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-teal-600">{data.studentCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">In department</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.pink}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion</CardTitle>
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-pink-600">
                  {data.courseCount > 0 ? Math.round((data.scheduledCount / data.courseCount) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Courses scheduled</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Courses by Year Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Courses by Year of Study</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    courses: {
                      label: "Courses",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.yearStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Courses by Semester Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Courses by Semester</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    courses: {
                      label: "Courses",
                      color: "hsl(var(--chart-2))",
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
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Schedule Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Schedule Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    classes: {
                      label: "Classes",
                      color: "#8b5cf6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.weeklyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="classes" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
                  <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-1">Manage Course Units</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove course units</p>
                </a>
                <a href="/hod/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Clock className="w-8 h-8 text-purple-600 mb-2" />
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
