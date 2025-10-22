import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

async function getHODSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("hod-session")
  if (!session) return null
  return JSON.parse(session.value)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getHODSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const course = await prisma.courseUnit.update({
      where: { id, departmentId: session.departmentId },
      data,
    })

    return NextResponse.json(course)
  } catch (error: any) {
    console.error("[v0] Error updating course:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Course with this code already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getHODSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.courseUnit.delete({
      where: { id, departmentId: session.departmentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
