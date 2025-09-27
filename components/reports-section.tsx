import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Download, Calendar, TrendingUp, Users, School, FileText, BarChart3 } from "lucide-react"

export function ReportsSection() {
  const monthlyData = [
    { month: "Jan", users: 38000, assessments: 8500, institutions: 220, completionRate: 78 },
    { month: "Feb", users: 39500, assessments: 9200, institutions: 225, completionRate: 81 },
    { month: "Mar", users: 41200, assessments: 10100, institutions: 235, completionRate: 84 },
    { month: "Apr", users: 43800, assessments: 11400, institutions: 242, completionRate: 87 },
    { month: "May", users: 45231, assessments: 12847, institutions: 247, completionRate: 89 },
    { month: "Jun", users: 47650, assessments: 14200, institutions: 252, completionRate: 91 },
  ]

  const institutionTypes = [
    { name: "Universities", value: 89, color: "#6366f1" },
    { name: "High Schools", value: 124, color: "#3b82f6" },
    { name: "Middle Schools", value: 34, color: "#10b981" },
    { name: "Technical Schools", value: 28, color: "#f59e0b" },
    { name: "Vocational Centers", value: 15, color: "#ef4444" },
  ]

  const performanceByRegion = [
    { region: "North", score: 92, institutions: 67, users: 15420 },
    { region: "Central", score: 89, institutions: 89, users: 18750 },
    { region: "South", score: 85, institutions: 45, users: 8930 },
    { region: "West", score: 88, institutions: 34, users: 12340 },
    { region: "East", score: 91, institutions: 56, users: 14680 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Advanced Reports</h2>
          <p className="text-muted-foreground">Detailed analysis and data export</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Institution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                <SelectItem value="itc">Central Technology Institute</SelectItem>
                <SelectItem value="uninorte">Northern University</SelectItem>
                <SelectItem value="sanpatricio">St. Patrick's College</SelectItem>
                <SelectItem value="academia">Academy of Sciences</SelectItem>
                <SelectItem value="business">International Business School</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="teachers">Teachers</SelectItem>
                <SelectItem value="admins">Administrators</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Monthly Growth</CardTitle>
            <CardDescription>Evolution of users, assessments and institutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="assessments" stroke="#3b82f6" strokeWidth={2} name="Assessments" />
                <Line type="monotone" dataKey="institutions" stroke="#10b981" strokeWidth={2} name="Institutions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Distribution by Type</CardTitle>
            <CardDescription>Institutions by educational category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={institutionTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {institutionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Performance by Region</CardTitle>
            <CardDescription>Average scores and user distribution across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="region" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Predefined Reports</CardTitle>
          <CardDescription>Quick access to frequently used reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Weekly Activity Report",
                description: "Active users, sessions and completed assessments",
                icon: TrendingUp,
                badge: "Updated",
                color: "bg-green-500/20 text-green-400",
              },
              {
                title: "Institutional Performance Analysis",
                description: "Comparative metrics between institutions",
                icon: School,
                badge: "Popular",
                color: "bg-blue-500/20 text-blue-400",
              },
              {
                title: "User Statistics",
                description: "Demographics, roles and usage patterns",
                icon: Users,
                badge: "New",
                color: "bg-purple-500/20 text-purple-400",
              },
              {
                title: "Content Engagement Report",
                description: "Most accessed materials and completion rates",
                icon: FileText,
                badge: "Trending",
                color: "bg-orange-500/20 text-orange-400",
              },
              {
                title: "Assessment Analytics",
                description: "Self-evaluation trends and risk patterns",
                icon: BarChart3,
                badge: "Critical",
                color: "bg-red-500/20 text-red-400",
              },
              {
                title: "Regional Performance",
                description: "Geographic distribution and performance metrics",
                icon: TrendingUp,
                badge: "Monthly",
                color: "bg-cyan-500/20 text-cyan-400",
              },
            ].map((report, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-full ${report.color}`}>
                    <report.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {report.badge}
                  </Badge>
                </div>
                <h4 className="font-medium text-card-foreground mb-2">{report.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
