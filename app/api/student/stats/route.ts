import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("student-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, departmentId } = JSON.parse(session.value)

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const [myCourseCount, totalCredits, scheduledCount] = await Promise.all([
      prisma.courseUnit.count({
        where: {
          departmentId: student.departmentId,
          yearOfStudy: student.yearOfStudy,
        },
      }),
      prisma.courseUnit.aggregate({
        where: {
          departmentId: student.departmentId,
          yearOfStudy: student.yearOfStudy,
        },
        _sum: {
          credits: true,
        },
      }),
      prisma.courseUnit.count({
        where: {
          departmentId: student.departmentId,
          yearOfStudy: student.yearOfStudy,
          AND: [{ venue: { not: null } }, { startTime: { not: null } }],
        },
      }),
    ])

    const coursesByDay = await prisma.courseUnit.groupBy({
      by: ["dayOfWeek"],
      where: {
        departmentId: student.departmentId,
        yearOfStudy: student.yearOfStudy,
        dayOfWeek: { not: null },
      },
      _count: true,
    })

    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const weeklySchedule = daysOrder.map((day) => {
      const found = coursesByDay.find((item) => item.dayOfWeek === day)
      return {
        day: day.substring(0, 3), // Shorten day names for chart
        classes: found ? found._count : 0,
      }
    })

    const coursesBySemester = await prisma.courseUnit.groupBy({
      by: ["semester"],
      where: {
        departmentId: student.departmentId,
        yearOfStudy: student.yearOfStudy,
        semester: { not: null },
      },
      _count: true,
    })

    const semesterStats = coursesBySemester.map((item) => ({
      semester: item.semester || "Unassigned",
      count: item._count,
    }))

    const courses = await prisma.courseUnit.findMany({
      where: {
        departmentId: student.departmentId,
        yearOfStudy: student.yearOfStudy,
      },
      select: {
        code: true,
        credits: true,
      },
      take: 10, // Limit to 10 courses for readability
    })

    const creditStats = courses.map((course) => ({
      course: course.code,
      credits: course.credits,
    }))

    return NextResponse.json({
      student,
      myCourseCount,
      totalCredits: totalCredits._sum.credits || 0,
      scheduledCount,
      weeklySchedule,
      semesterStats,
      creditStats,
    })
  } catch (error) {
    console.error("[v0] Student stats error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
