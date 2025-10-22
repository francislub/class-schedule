import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password, departmentId } = await request.json()

    // Find student by email and department
    const student = await prisma.student.findFirst({
      where: {
        email,
        departmentId,
      },
      include: {
        department: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real application, you would verify the password hash
    // For now, we'll accept any password for demonstration

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "student-session",
      JSON.stringify({ email: student.email, departmentId: student.departmentId, studentId: student.id }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    )

    return NextResponse.json({ success: true, student })
  } catch (error) {
    console.error("[v0] Student login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
