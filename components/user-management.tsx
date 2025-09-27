import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, MoreHorizontal, UserPlus, Shield, Clock, Mail } from "lucide-react"

export function UserManagement() {
  const users = [
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@itcentral.edu.mx",
      role: "Director",
      institution: "Central Technology Institute",
      status: "Active",
      lastLogin: "2 hours ago",
      joinDate: "Jan 2023",
      permissions: ["Full Access", "User Management"],
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@uninorte.edu.mx",
      role: "Administrator",
      institution: "Northern University",
      status: "Active",
      lastLogin: "1 day ago",
      joinDate: "Mar 2023",
      permissions: ["Content Management", "Reports"],
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana.martinez@sanpatricio.edu.mx",
      role: "Teacher",
      institution: "St. Patrick's College",
      status: "Inactive",
      lastLogin: "1 week ago",
      joinDate: "Sep 2023",
      permissions: ["Content Access", "Student Management"],
    },
    {
      id: "4",
      name: "Luis Hernández",
      email: "luis.hernandez@academia.edu.mx",
      role: "Student",
      institution: "Academy of Sciences",
      status: "Active",
      lastLogin: "30 min ago",
      joinDate: "Aug 2023",
      permissions: ["Self Assessment", "Content Access"],
    },
    {
      id: "5",
      name: "Patricia Silva",
      email: "patricia.silva@business.edu.mx",
      role: "Director",
      institution: "International Business School",
      status: "Active",
      lastLogin: "4 hours ago",
      joinDate: "Feb 2023",
      permissions: ["Full Access", "Analytics"],
    },
    {
      id: "6",
      name: "Roberto Morales",
      email: "roberto.morales@maritime.edu.mx",
      role: "Administrator",
      institution: "Maritime Technical Institute",
      status: "Suspended",
      lastLogin: "3 days ago",
      joinDate: "Jun 2023",
      permissions: ["Limited Access"],
    },
    {
      id: "7",
      name: "Elena Vásquez",
      email: "elena.vasquez@itcentral.edu.mx",
      role: "Teacher",
      institution: "Central Technology Institute",
      status: "Active",
      lastLogin: "1 hour ago",
      joinDate: "Nov 2023",
      permissions: ["Content Creation", "Student Assessment"],
    },
    {
      id: "8",
      name: "Diego Ramírez",
      email: "diego.ramirez@uninorte.edu.mx",
      role: "Student",
      institution: "Northern University",
      status: "Active",
      lastLogin: "15 min ago",
      joinDate: "Jan 2024",
      permissions: ["Self Assessment", "Peer Collaboration"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Global User Management</h2>
          <p className="text-muted-foreground">Manage users across all institutions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Import Users
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New User
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name, email or institution..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">User List</CardTitle>
          <CardDescription>Showing 8 of 45,231 total users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-card-foreground">User</TableHead>
                <TableHead className="text-card-foreground">Role</TableHead>
                <TableHead className="text-card-foreground">Institution</TableHead>
                <TableHead className="text-card-foreground">Status</TableHead>
                <TableHead className="text-card-foreground">Last Access</TableHead>
                <TableHead className="text-card-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-card-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-card-foreground">{user.institution}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : user.status === "Suspended" ? "destructive" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {user.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
