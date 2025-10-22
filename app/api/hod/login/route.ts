import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password, departmentId } = await request.json()

    // Find HOD by email and department
    const hod = await prisma.hOD.findFirst({
      where: {
        email,
        departmentId,
      },
      include: {
        department: true,
      },
    })

    if (!hod) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real application, you would verify the password hash
    // For now, we'll accept any password for demonstration

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("hod-session", JSON.stringify({ email: hod.email, departmentId: hod.departmentId }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, hod })
  } catch (error) {
    console.error("[v0] HOD login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
