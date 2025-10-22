import { NextResponse } from "next/headers"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
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
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get("semester")

    // Build query
    const where: any = {
      departmentId: student.departmentId,
      year: student.year,
    }

    if (semester) {
      where.semester = Number.parseInt(semester)
    }

    // Get courses
    const courses = await prisma.courseUnit.findMany({
      where,
      orderBy: [{ semester: "asc" }, { courseCode: "asc" }],
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("[v0] Student courses error:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
