import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email"

const ADMIN_CODE = "12345"

export async function POST(request: NextRequest) {
  try {
    const { email, adminCode } = await request.json()

    // Validate admin code
    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: "Invalid admin code" }, { status: 401 })
    }

    // Check if admin exists or create one
    let admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          email,
          name: "Admin",
        },
      })
    }

    // Generate and store verification code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, code)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
