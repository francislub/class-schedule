import { NextResponse } from "next/headers"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("student-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    const studentId = sessionData.studentId

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get course statistics for this student's year and department
    const [totalCourses, semester1Courses, semester2Courses] = await Promise.all([
      prisma.courseUnit.count({
        where: {
          departmentId: student.departmentId,
          year: student.year,
        },
      }),
      prisma.courseUnit.count({
        where: {
          departmentId: student.departmentId,
          year: student.year,
          semester: 1,
        },
      }),
      prisma.courseUnit.count({
        where: {
          departmentId: student.departmentId,
          year: student.year,
          semester: 2,
        },
      }),
    ])

    return NextResponse.json({
      student: {
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        year: student.year,
        department: student.department.name,
      },
      stats: {
        totalCourses,
        semester1Courses,
        semester2Courses,
      },
    })
  } catch (error) {
    console.error("[v0] Student stats error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
