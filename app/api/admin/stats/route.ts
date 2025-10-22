import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get statistics
    const [departmentCount, hodCount, courseCount, studentCount] = await Promise.all([
      prisma.department.count(),
      prisma.hOD.count(),
      prisma.courseUnit.count(),
      prisma.student.count(),
    ])

    // Get recent activities
    const recentDepartments = await prisma.department.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    })

    const recentHODs = await prisma.hOD.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        department: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    })

    return NextResponse.json({
      stats: {
        departments: departmentCount,
        hods: hodCount,
        courses: courseCount,
        students: studentCount,
      },
      recentDepartments,
      recentHODs,
    })
  } catch (error) {
    console.error("[v0] Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
