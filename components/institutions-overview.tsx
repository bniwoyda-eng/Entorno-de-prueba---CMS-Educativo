import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, MapPin, Users, TrendingUp, AlertCircle, GraduationCap, BookOpen } from "lucide-react"

export function InstitutionsOverview() {
  const institutions = [
    {
      name: "Central Technology Institute",
      location: "Mexico City, Mexico",
      students: 2847,
      teachers: 156,
      completion: 94,
      status: "Excellent",
      statusColor: "bg-green-500",
      alerts: 0,
      type: "University",
      established: "1985",
      programs: 24,
    },
    {
      name: "Northern University",
      location: "Monterrey, Mexico",
      students: 3921,
      teachers: 203,
      completion: 87,
      status: "Good",
      statusColor: "bg-blue-500",
      alerts: 2,
      type: "University",
      established: "1978",
      programs: 31,
    },
    {
      name: "St. Patrick's College",
      location: "Guadalajara, Mexico",
      students: 1456,
      teachers: 89,
      completion: 76,
      status: "Regular",
      statusColor: "bg-yellow-500",
      alerts: 5,
      type: "High School",
      established: "1992",
      programs: 8,
    },
    {
      name: "Academy of Sciences",
      location: "Puebla, Mexico",
      students: 892,
      teachers: 67,
      completion: 91,
      status: "Excellent",
      statusColor: "bg-green-500",
      alerts: 1,
      type: "Technical School",
      established: "1995",
      programs: 12,
    },
    {
      name: "International Business School",
      location: "Tijuana, Mexico",
      students: 2134,
      teachers: 98,
      completion: 89,
      status: "Good",
      statusColor: "bg-blue-500",
      alerts: 0,
      type: "University",
      established: "2001",
      programs: 18,
    },
    {
      name: "Maritime Technical Institute",
      location: "Veracruz, Mexico",
      students: 756,
      teachers: 45,
      completion: 82,
      status: "Good",
      statusColor: "bg-blue-500",
      alerts: 3,
      type: "Technical School",
      established: "1988",
      programs: 6,
    },
  ]

  const recentActivities = [
    {
      type: "success",
      icon: TrendingUp,
      title: "New Institution Registered",
      description: "Benito Juárez Preparatory School joined the platform with 1,200 students",
      time: "2 hours ago",
      institution: "Benito Juárez Preparatory",
    },
    {
      type: "warning",
      icon: AlertCircle,
      title: "Performance Alert",
      description: "St. Patrick's College reports 15% decrease in self-assessment completion",
      time: "4 hours ago",
      institution: "St. Patrick's College",
    },
    {
      type: "info",
      icon: Users,
      title: "Peak User Activity",
      description: "12,847 simultaneous users connected - new monthly record",
      time: "6 hours ago",
      institution: "Platform-wide",
    },
    {
      type: "success",
      icon: GraduationCap,
      title: "Certification Milestone",
      description: "Northern University completed 500+ teacher certifications this month",
      time: "8 hours ago",
      institution: "Northern University",
    },
    {
      type: "info",
      icon: BookOpen,
      title: "Content Update",
      description: "25 new learning modules published across STEM programs",
      time: "12 hours ago",
      institution: "Content Team",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Featured Institutions</CardTitle>
          <CardDescription>Performance and key metrics by institution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {institutions.map((institution, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${institution.statusColor}`} />
                  <h4 className="font-medium text-card-foreground">{institution.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {institution.type}
                  </Badge>
                  {institution.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {institution.alerts} alerts
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {institution.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {institution.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {institution.programs} programs
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={institution.completion} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-card-foreground">{institution.completion}%</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
          <CardDescription>Important events and changes in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div
                className={`p-2 rounded-full ${
                  activity.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : activity.type === "warning"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                }`}
              >
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-card-foreground text-sm">{activity.title}</h5>
                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.institution}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
