import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(departments)
  } catch (error) {
    console.error("[v0] Error fetching departments:", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, code, description } = await request.json()

    const department = await prisma.department.create({
      data: {
        name,
        code,
        description: description || null,
      },
    })

    return NextResponse.json(department)
  } catch (error: any) {
    console.error("[v0] Error creating department:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Department with this name or code already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
  }
}
