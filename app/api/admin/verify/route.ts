import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Find valid verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 401 })
    }

    // Delete used verification code
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return NextResponse.json({ error: "An error occurred during verification" }, { status: 500 })
  }
}
