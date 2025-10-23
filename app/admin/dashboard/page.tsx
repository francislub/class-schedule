"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, BookOpen, TrendingUp, GraduationCap, Calendar } from "lucide-react"
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
  blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200",
  green: "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200",
  purple: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200",
  orange: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200",
  teal: "bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200",
  pink: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-200",
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#14b8a6", "#ec4899"]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the Bugema University admin portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className={CARD_COLORS.blue}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                <Building2 className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{stats?.departmentCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Active departments</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.green}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total HODs</CardTitle>
                <Users className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{stats?.hodCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered HODs</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.purple}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Course Units</CardTitle>
                <BookOpen className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">{stats?.courseCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Total courses</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.orange}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="w-5 h-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{stats?.studentCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered students</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.teal}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Classes</CardTitle>
                <Calendar className="w-5 h-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-teal-600">{stats?.scheduledCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">With time & venue</p>
              </CardContent>
            </Card>

            <Card className={CARD_COLORS.pink}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Departments Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Courses by Department</CardTitle>
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
                    <BarChart data={stats?.departmentStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="courses" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Students by Year Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Students by Year of Study</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    students: {
                      label: "Students",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.yearStats || []}
                        dataKey="count"
                        nameKey="year"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {(stats?.yearStats || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Growth Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>System Growth Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    departments: {
                      label: "Departments",
                      color: "#3b82f6",
                    },
                    courses: {
                      label: "Courses",
                      color: "#10b981",
                    },
                    students: {
                      label: "Students",
                      color: "#8b5cf6",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.growthStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="departments" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="courses" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={2} />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/departments" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-1">Manage Departments</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove departments</p>
                </a>
                <a href="/admin/hods" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Users className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Manage HODs</h3>
                  <p className="text-sm text-muted-foreground">Register and manage HODs</p>
                </a>
                <a href="/admin/departments" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
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
