import { NextResponse } from "next/headers"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("hod-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    const hodId = sessionData.hodId

    // Get HOD details
    const hod = await prisma.hOD.findUnique({
      where: { id: hodId },
      include: {
        department: true,
      },
    })

    if (!hod) {
      return NextResponse.json({ error: "HOD not found" }, { status: 404 })
    }

    // Get statistics for this department
    const [courseCount, studentCount] = await Promise.all([
      prisma.courseUnit.count({
        where: { departmentId: hod.departmentId },
      }),
      prisma.student.count({
        where: { departmentId: hod.departmentId },
      }),
    ])

    // Get courses by year
    const coursesByYear = await prisma.courseUnit.groupBy({
      by: ["year"],
      where: { departmentId: hod.departmentId },
      _count: true,
    })

    // Get courses by semester
    const coursesBySemester = await prisma.courseUnit.groupBy({
      by: ["semester"],
      where: { departmentId: hod.departmentId },
      _count: true,
    })

    return NextResponse.json({
      stats: {
        courses: courseCount,
        students: studentCount,
        department: hod.department.name,
      },
      coursesByYear: coursesByYear.map((item) => ({
        year: item.year,
        count: item._count,
      })),
      coursesBySemester: coursesBySemester.map((item) => ({
        semester: item.semester,
        count: item._count,
      })),
    })
  } catch (error) {
    console.error("[v0] HOD stats error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
