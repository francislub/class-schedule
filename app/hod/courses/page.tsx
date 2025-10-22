"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HODSidebar } from "@/components/hod-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const SEMESTERS = ["Semester 1", "Semester 2"]
const YEARS = [1, 2, 3, 4]

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseUnit | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "3",
    lecturer: "",
    lecturerContact: "",
    venue: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    semester: "",
    yearOfStudy: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/hod/courses")
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingCourse ? `/api/hod/courses/${editingCourse.id}` : "/api/hod/courses"
      const method = editingCourse ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          credits: Number.parseInt(formData.credits),
          yearOfStudy: formData.yearOfStudy ? Number.parseInt(formData.yearOfStudy) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Course ${editingCourse ? "updated" : "created"} successfully`,
        })
        setDialogOpen(false)
        resetForm()
        fetchCourses()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: "3",
      lecturer: "",
      lecturerContact: "",
      venue: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      semester: "",
      yearOfStudy: "",
    })
    setEditingCourse(null)
  }

  const handleEdit = (course: CourseUnit) => {
    setEditingCourse(course)
    setFormData({
      code: course.code,
      name: course.name,
      description: course.description || "",
      credits: course.credits.toString(),
      lecturer: course.lecturer || "",
      lecturerContact: course.lecturerContact || "",
      venue: course.venue || "",
      dayOfWeek: course.dayOfWeek || "",
      startTime: course.startTime || "",
      endTime: course.endTime || "",
      semester: course.semester || "",
      yearOfStudy: course.yearOfStudy?.toString() || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
      const response = await fetch(`/api/hod/courses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully",
        })
        fetchCourses()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      <HODSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Course Units</h1>
              <p className="text-muted-foreground">Manage course units and schedules</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCourse ? "Edit Course Unit" : "Add New Course Unit"}</DialogTitle>
                  <DialogDescription>
                    {editingCourse
                      ? "Update the course information below"
                      : "Fill in the details to create a new course"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Course Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., CS101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credits">Credits</Label>
                      <Input
                        id="credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        min="1"
                        max="6"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Introduction to Programming"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the course"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lecturer">Lecturer (Optional)</Label>
                      <Input
                        id="lecturer"
                        value={formData.lecturer}
                        onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                        placeholder="e.g., Dr. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lecturerContact">Lecturer Contact (Optional)</Label>
                      <Input
                        id="lecturerContact"
                        value={formData.lecturerContact}
                        onChange={(e) => setFormData({ ...formData, lecturerContact: e.target.value })}
                        placeholder="e.g., +256 700 000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue (Optional)</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g., Room 101, Main Building"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dayOfWeek">Day (Optional)</Label>
                      <Select
                        value={formData.dayOfWeek}
                        onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time (Optional)</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time (Optional)</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester (Optional)</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) => setFormData({ ...formData, semester: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEMESTERS.map((sem) => (
                            <SelectItem key={sem} value={sem}>
                              {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study (Optional)</Label>
                      <Select
                        value={formData.yearOfStudy}
                        onValueChange={(value) => setFormData({ ...formData, yearOfStudy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              Year {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Saving..." : editingCourse ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Course Units</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading...</p>
              ) : courses.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No courses found. Add your first course to get started.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Lecturer</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.lecturer || "-"}</TableCell>
                          <TableCell>
                            {course.dayOfWeek && course.startTime && course.endTime
                              ? `${course.dayOfWeek} ${course.startTime}-${course.endTime}`
                              : "-"}
                          </TableCell>
                          <TableCell>{course.venue || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
