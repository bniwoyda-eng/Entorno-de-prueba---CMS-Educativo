import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, MoreHorizontal, UserPlus, Shield } from "lucide-react"

export function UserManagement() {
  const users = [
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@itcentral.edu.mx",
      role: "Director",
      institution: "Instituto Tecnológico Central",
      status: "Activo",
      lastLogin: "Hace 2 horas",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@uninorte.edu.mx",
      role: "Administrador",
      institution: "Universidad del Norte",
      status: "Activo",
      lastLogin: "Hace 1 día",
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana.martinez@sanpatricio.edu.mx",
      role: "Docente",
      institution: "Colegio San Patricio",
      status: "Inactivo",
      lastLogin: "Hace 1 semana",
    },
    {
      id: "4",
      name: "Luis Hernández",
      email: "luis.hernandez@academia.edu.mx",
      role: "Estudiante",
      institution: "Academia de Ciencias",
      status: "Activo",
      lastLogin: "Hace 30 min",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión Global de Usuarios</h2>
          <p className="text-muted-foreground">Administra usuarios de todas las instituciones</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Importar usuarios
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo usuario
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Filtros de búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por nombre, email o institución..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="teacher">Docente</SelectItem>
                <SelectItem value="student">Estudiante</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Más filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Lista de usuarios</CardTitle>
          <CardDescription>Mostrando 4 de 45,231 usuarios totales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-card-foreground">Usuario</TableHead>
                <TableHead className="text-card-foreground">Rol</TableHead>
                <TableHead className="text-card-foreground">Institución</TableHead>
                <TableHead className="text-card-foreground">Estado</TableHead>
                <TableHead className="text-card-foreground">Último acceso</TableHead>
                <TableHead className="text-card-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-card-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
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
                    <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
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
