import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, code, departmentId } = await request.json()

    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 401 })
    }

    // Find HOD
    const hod = await prisma.hOD.findFirst({
      where: {
        email,
        departmentId,
      },
    })

    if (!hod) {
      return NextResponse.json({ error: "HOD not found" }, { status: 401 })
    }

    // Delete used verification code
    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("hod-session", JSON.stringify({ email: hod.email, departmentId: hod.departmentId }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] HOD verification error:", error)
    return NextResponse.json({ error: "An error occurred during verification" }, { status: 500 })
  }
}
