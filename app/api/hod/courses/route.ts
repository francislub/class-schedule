import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

async function getHODSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("hod-session")
  if (!session) return null
  return JSON.parse(session.value)
}

export async function GET() {
  try {
    const session = await getHODSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await prisma.courseUnit.findMany({
      where: { departmentId: session.departmentId },
      orderBy: { code: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[v0] Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getHODSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const course = await prisma.courseUnit.create({
      data: {
        ...data,
        departmentId: session.departmentId,
      },
    })

    return NextResponse.json(course)
  } catch (error: any) {
    console.error("[v0] Error creating course:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Course with this code already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
