"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, UserCog, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-teal-600/20 to-purple-600/20 animate-pulse" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Background Image with enhanced overlay */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-21%20at%2022.05.48_b4f13e19-waPLF2sWdQZXOSz3ZQeG6hKSEtuDmg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16 backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent animate-fade-in">
              Bugema University
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl md:text-3xl text-blue-100 mb-3 font-semibold">Class Schedule Management System</p>
          <p className="text-lg text-teal-200 font-medium">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Admin Portal */}
          <Link href="/admin/login" className="group">
            <Card className="h-full transition-all duration-500 hover:scale-110 border-2 border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/50 hover:border-blue-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/30 group-hover:to-blue-600/30 transition-all duration-500" />

              <CardContent className="flex flex-col items-center justify-center p-10 h-full relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/50">
                  <UserCog className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-center text-white group-hover:text-blue-200 transition-colors">
                  Admin
                </h2>
                <p className="text-blue-100 text-center text-base leading-relaxed">
                  Manage departments, HODs, and system settings
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* HOD Portal */}
          <Link href="/hod/select-department" className="group">
            <Card className="h-full transition-all duration-500 hover:scale-110 border-2 border-white/20 bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-xl hover:shadow-2xl hover:shadow-teal-500/50 hover:border-teal-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-teal-600/0 group-hover:from-teal-400/30 group-hover:to-teal-600/30 transition-all duration-500" />

              <CardContent className="flex flex-col items-center justify-center p-10 h-full relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-teal-500/50">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-center text-white group-hover:text-teal-200 transition-colors">
                  HOD
                </h2>
                <p className="text-teal-100 text-center text-base leading-relaxed">
                  Manage course units, schedules, and department resources
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Student Portal */}
          <Link href="/student/select-department" className="group">
            <Card className="h-full transition-all duration-500 hover:scale-110 border-2 border-white/20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/50 hover:border-purple-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/30 group-hover:to-purple-600/30 transition-all duration-500" />

              <CardContent className="flex flex-col items-center justify-center p-10 h-full relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-purple-500/50">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-center text-white group-hover:text-purple-200 transition-colors">
                  Student
                </h2>
                <p className="text-purple-100 text-center text-base leading-relaxed">
                  View course schedules, venues, and lecturer information
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-16 text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-blue-100 text-base font-medium">Powered by Bugema University IT Department</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}
