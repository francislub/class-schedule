import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, code, description } = await request.json()

    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        code,
        description: description || null,
      },
    })

    return NextResponse.json(department)
  } catch (error: any) {
    console.error("[v0] Error updating department:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Department with this name or code already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.department.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting department:", error)
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
  }
}
