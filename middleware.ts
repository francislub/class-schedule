import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminSession = request.cookies.get("admin-session")
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // HOD routes protection
  if (
    pathname.startsWith("/hod") &&
    !pathname.startsWith("/hod/login") &&
    !pathname.startsWith("/hod/select-department")
  ) {
    const hodSession = request.cookies.get("hod-session")
    if (!hodSession) {
      return NextResponse.redirect(new URL("/hod/select-department", request.url))
    }
  }

  // Student routes protection
  if (
    pathname.startsWith("/student") &&
    !pathname.startsWith("/student/auth") &&
    !pathname.startsWith("/student/select-department")
  ) {
    const studentSession = request.cookies.get("student-session")
    if (!studentSession) {
      return NextResponse.redirect(new URL("/student/select-department", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/hod/:path*", "/student/:path*"],
}
