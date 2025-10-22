import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const hods = await prisma.hOD.findMany({
      include: {
        department: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(hods)
  } catch (error) {
    console.error("[v0] Error fetching HODs:", error)
    return NextResponse.json({ error: "Failed to fetch HODs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, departmentId } = await request.json()

    const hod = await prisma.hOD.create({
      data: {
        name,
        email,
        phone: phone || null,
        departmentId,
      },
      include: {
        department: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    })

    return NextResponse.json(hod)
  } catch (error: any) {
    console.error("[v0] Error creating HOD:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "HOD with this email already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create HOD" }, { status: 500 })
  }
}
