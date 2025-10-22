import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, studentNumber, phone, yearOfStudy, departmentId, password } = await request.json()

    // In a real application, you would hash the password
    // For now, we'll just store it (not recommended in production)

    const student = await prisma.student.create({
      data: {
        name,
        email,
        studentNumber,
        phone: phone || null,
        yearOfStudy,
        departmentId,
      },
      include: {
        department: true,
      },
    })

    return NextResponse.json({ success: true, student })
  } catch (error: any) {
    console.error("[v0] Student registration error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Student with this email or student number already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
