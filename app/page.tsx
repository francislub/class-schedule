import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, UserCog } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=university+campus+aerial+view)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Bugema University</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">Class Schedule Management System</p>
          <p className="text-lg text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Admin Portal */}
          <Link href="/admin/login" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center p-8 h-full">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <UserCog className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center">Admin</h2>
                <p className="text-muted-foreground text-center text-sm">
                  Manage departments, HODs, and system setting
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* HOD Portal */}
          <Link href="/hod/select-department" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-secondary">
              <CardContent className="flex flex-col items-center justify-center p-8 h-full">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center">HOD</h2>
                <p className="text-muted-foreground text-center text-sm">
                  Manage course units, schedules, and department resources
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Student Portal */}
          <Link href="/student/select-department" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-accent">
              <CardContent className="flex flex-col items-center justify-center p-8 h-full">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <GraduationCap className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center">Student</h2>
                <p className="text-muted-foreground text-center text-sm">
                  View course schedules, venues, and lecturer information
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by Bugema University IT Department</p>
        </div>
      </div>
    </div>
  )
}
