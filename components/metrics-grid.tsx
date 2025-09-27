import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, School, AlertTriangle, Activity, UserCheck, FileText } from "lucide-react"

export function MetricsGrid() {
  const metrics = [
    {
      title: "Active Institutions",
      value: "247",
      change: "+12%",
      changeType: "positive" as const,
      icon: School,
      description: "vs. previous month",
    },
    {
      title: "Total Users",
      value: "45,231",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
      description: "Students, teachers & admin",
    },
    {
      title: "Completed Self-Assessments",
      value: "12,847",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: UserCheck,
      description: "This month",
    },
    {
      title: "Critical Alerts",
      value: "23",
      change: "-5",
      changeType: "negative" as const,
      icon: AlertTriangle,
      description: "Require attention",
    },
    {
      title: "Daily Activity",
      value: "8,942",
      change: "+3.1%",
      changeType: "positive" as const,
      icon: Activity,
      description: "Active sessions",
    },
    {
      title: "Published Content",
      value: "1,284",
      change: "+24",
      changeType: "positive" as const,
      icon: FileText,
      description: "New this week",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={metric.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                {metric.change}
              </Badge>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
