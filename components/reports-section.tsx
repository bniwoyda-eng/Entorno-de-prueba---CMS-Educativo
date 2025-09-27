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
} from "recharts"
import { Download, Calendar, TrendingUp, Users, School } from "lucide-react"

export function ReportsSection() {
  const monthlyData = [
    { month: "Ene", usuarios: 38000, evaluaciones: 8500, instituciones: 220 },
    { month: "Feb", usuarios: 39500, evaluaciones: 9200, instituciones: 225 },
    { month: "Mar", usuarios: 41200, evaluaciones: 10100, instituciones: 235 },
    { month: "Abr", usuarios: 43800, evaluaciones: 11400, instituciones: 242 },
    { month: "May", usuarios: 45231, evaluaciones: 12847, instituciones: 247 },
  ]

  const institutionTypes = [
    { name: "Universidades", value: 89, color: "#8b5cf6" },
    { name: "Preparatorias", value: 124, color: "#06b6d4" },
    { name: "Secundarias", value: 34, color: "#10b981" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reportes Avanzados</h2>
          <p className="text-muted-foreground">Análisis detallado y exportación de datos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Programar reporte
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar todo
          </Button>
        </div>
      </div>

      {/* Filtros de reporte */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Configuración de reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Institución" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las instituciones</SelectItem>
                <SelectItem value="itc">Instituto Tecnológico Central</SelectItem>
                <SelectItem value="uninorte">Universidad del Norte</SelectItem>
                <SelectItem value="sanpatricio">Colegio San Patricio</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="students">Estudiantes</SelectItem>
                <SelectItem value="teachers">Docentes</SelectItem>
                <SelectItem value="admins">Administradores</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Generar reporte</Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos y métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Crecimiento mensual</CardTitle>
            <CardDescription>Evolución de usuarios, evaluaciones e instituciones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="usuarios" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="evaluaciones" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="instituciones" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Distribución por tipo</CardTitle>
            <CardDescription>Instituciones por categoría educativa</CardDescription>
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
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reportes predefinidos */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Reportes predefinidos</CardTitle>
          <CardDescription>Acceso rápido a reportes frecuentemente utilizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Reporte de actividad semanal",
                description: "Usuarios activos, sesiones y evaluaciones completadas",
                icon: TrendingUp,
                badge: "Actualizado",
              },
              {
                title: "Análisis de rendimiento institucional",
                description: "Comparativa de métricas entre instituciones",
                icon: School,
                badge: "Popular",
              },
              {
                title: "Estadísticas de usuarios",
                description: "Demografía, roles y patrones de uso",
                icon: Users,
                badge: "Nuevo",
              },
            ].map((report, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <report.icon className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {report.badge}
                  </Badge>
                </div>
                <h4 className="font-medium text-card-foreground mb-2">{report.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="mr-2 h-3 w-3" />
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
