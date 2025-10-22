import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("student-session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { departmentId } = JSON.parse(session.value)
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json([])
    }

    const courses = await prisma.courseUnit.findMany({
      where: {
        departmentId,
        OR: [{ code: { contains: query, mode: "insensitive" } }, { name: { contains: query, mode: "insensitive" } }],
      },
      orderBy: { code: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[v0] Error searching courses:", error)
    return NextResponse.json({ error: "Failed to search courses" }, { status: 500 })
  }
}
