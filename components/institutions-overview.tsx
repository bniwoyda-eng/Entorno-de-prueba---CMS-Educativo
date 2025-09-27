import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, MapPin, Users, TrendingUp, AlertCircle } from "lucide-react"

export function InstitutionsOverview() {
  const institutions = [
    {
      name: "Instituto Tecnológico Central",
      location: "Ciudad de México",
      students: 2847,
      teachers: 156,
      completion: 94,
      status: "Excelente",
      statusColor: "bg-green-500",
      alerts: 0,
    },
    {
      name: "Universidad del Norte",
      location: "Monterrey",
      students: 3921,
      teachers: 203,
      completion: 87,
      status: "Bueno",
      statusColor: "bg-blue-500",
      alerts: 2,
    },
    {
      name: "Colegio San Patricio",
      location: "Guadalajara",
      students: 1456,
      teachers: 89,
      completion: 76,
      status: "Regular",
      statusColor: "bg-yellow-500",
      alerts: 5,
    },
    {
      name: "Academia de Ciencias",
      location: "Puebla",
      students: 892,
      teachers: 67,
      completion: 91,
      status: "Excelente",
      statusColor: "bg-green-500",
      alerts: 1,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Instituciones Destacadas</CardTitle>
          <CardDescription>Rendimiento y métricas clave por institución</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {institutions.map((institution, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${institution.statusColor}`} />
                  <h4 className="font-medium text-card-foreground">{institution.name}</h4>
                  {institution.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {institution.alerts} alertas
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
                    {institution.students.toLocaleString()} estudiantes
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
          <CardTitle className="text-card-foreground">Actividad Reciente</CardTitle>
          <CardDescription>Eventos y cambios importantes en las últimas 24 horas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              type: "success",
              icon: TrendingUp,
              title: "Nueva institución registrada",
              description: "Preparatoria Benito Juárez se unió a la plataforma",
              time: "Hace 2 horas",
            },
            {
              type: "warning",
              icon: AlertCircle,
              title: "Alerta de rendimiento",
              description: "Colegio San Patricio reporta baja en autoevaluaciones",
              time: "Hace 4 horas",
            },
            {
              type: "info",
              icon: Users,
              title: "Pico de usuarios activos",
              description: "12,847 usuarios conectados simultáneamente",
              time: "Hace 6 horas",
            },
          ].map((activity, index) => (
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
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
