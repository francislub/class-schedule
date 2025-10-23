import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, departmentId } = await request.json()

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
      return NextResponse.json({ error: "HOD not found for this department" }, { status: 401 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, code)

    return NextResponse.json({ success: true, message: "Verification code sent to your email" })
  } catch (error) {
    console.error("[v0] HOD login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
