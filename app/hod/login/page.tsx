"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

function HODLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [departmentName, setDepartmentName] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const departmentId = searchParams.get("departmentId")

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentName()
    }
  }, [departmentId])

  const fetchDepartmentName = async () => {
    try {
      const response = await fetch("/api/departments")
      const departments = await response.json()
      const dept = departments.find((d: any) => d.id === departmentId)
      if (dept) {
        setDepartmentName(`${dept.name} (${dept.code})`)
      }
    } catch (error) {
      console.error("[v0] Error fetching department:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/hod/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, departmentId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome to the HOD portal!",
        })
        router.push("/hod/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="w-full max-w-md">
        <Link
          href="/hod/select-department"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to department selection
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">HOD Login</CardTitle>
              <CardDescription>{departmentName || "Loading..."}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hod@bugema.ac.ug"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function HODLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HODLoginForm />
    </Suspense>
  )
}
