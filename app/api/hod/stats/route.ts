import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("hod-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, departmentId } = JSON.parse(session.value)

    const hod = await prisma.hOD.findFirst({
      where: { email, departmentId },
      include: {
        department: true,
      },
    })

    if (!hod) {
      return NextResponse.json({ error: "HOD not found" }, { status: 404 })
    }

    const [courseCount, studentCount, scheduledCount, venueCount] = await Promise.all([
      prisma.courseUnit.count({
        where: { departmentId: hod.departmentId },
      }),
      prisma.student.count({
        where: { departmentId: hod.departmentId },
      }),
      prisma.courseUnit.count({
        where: {
          departmentId: hod.departmentId,
          AND: [{ venue: { not: null } }, { startTime: { not: null } }],
        },
      }),
      prisma.courseUnit.count({
        where: {
          departmentId: hod.departmentId,
          venue: { not: null },
        },
      }),
    ])

    const coursesByYear = await prisma.courseUnit.groupBy({
      by: ["yearOfStudy"],
      where: {
        departmentId: hod.departmentId,
        yearOfStudy: { not: null },
      },
      _count: true,
    })

    const yearStats = coursesByYear.map((item) => ({
      year: `Year ${item.yearOfStudy}`,
      count: item._count,
    }))

    const coursesBySemester = await prisma.courseUnit.groupBy({
      by: ["semester"],
      where: {
        departmentId: hod.departmentId,
        semester: { not: null },
      },
      _count: true,
    })

    const semesterStats = coursesBySemester.map((item) => ({
      semester: item.semester || "Unassigned",
      count: item._count,
    }))

    const coursesByDay = await prisma.courseUnit.groupBy({
      by: ["dayOfWeek"],
      where: {
        departmentId: hod.departmentId,
        dayOfWeek: { not: null },
      },
      _count: true,
    })

    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const weeklyStats = daysOrder.map((day) => {
      const found = coursesByDay.find((item) => item.dayOfWeek === day)
      return {
        day,
        classes: found ? found._count : 0,
      }
    })

    return NextResponse.json({
      hod,
      courseCount,
      studentCount,
      scheduledCount,
      venueCount,
      yearStats,
      semesterStats,
      weeklyStats,
    })
  } catch (error) {
    console.error("[v0] HOD stats error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
