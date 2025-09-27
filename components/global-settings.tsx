import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Globe, Shield, Bell, Database, Mail, Settings, Save } from "lucide-react"

export function GlobalSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuraciones Globales</h2>
          <p className="text-muted-foreground">Ajustes generales de la plataforma CSM Educativo</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalización visual
              </CardTitle>
              <CardDescription>Configura la apariencia de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platform-name">Nombre de la plataforma</Label>
                    <Input id="platform-name" defaultValue="CSM Educativo" />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Eslogan</Label>
                    <Input id="tagline" defaultValue="Transformando la educación" />
                  </div>
                  <div>
                    <Label htmlFor="primary-color">Color primario</Label>
                    <div className="flex items-center gap-2">
                      <Input id="primary-color" defaultValue="#8b5cf6" className="w-24" />
                      <div className="w-8 h-8 rounded bg-primary border border-border"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Logo de la plataforma</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-2">
                        <Settings className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Arrastra tu logo aquí</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Seleccionar archivo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Gestión de módulos</CardTitle>
              <CardDescription>Activa o desactiva funcionalidades por institución</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Autoevaluaciones", description: "Sistema de evaluación automática", enabled: true },
                  { name: "Mensajería interna", description: "Chat entre usuarios de la plataforma", enabled: true },
                  { name: "Reportes avanzados", description: "Generación de reportes detallados", enabled: true },
                  { name: "Gamificación", description: "Sistema de puntos y logros", enabled: false },
                  { name: "Videoconferencias", description: "Integración con herramientas de video", enabled: false },
                  { name: "Biblioteca digital", description: "Repositorio de recursos educativos", enabled: true },
                ].map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium text-card-foreground">{module.name}</h4>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={module.enabled ? "default" : "secondary"}>
                        {module.enabled ? "Activo" : "Inactivo"}
                      </Badge>
                      <Switch checked={module.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de notificaciones
              </CardTitle>
              <CardDescription>Gestiona las notificaciones globales del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">Enviar alertas importantes por correo</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en la plataforma</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Reportes automáticos</Label>
                    <p className="text-sm text-muted-foreground">Envío programado de reportes semanales</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Plantilla de email</Label>
                <Textarea
                  placeholder="Personaliza el mensaje de las notificaciones por email..."
                  className="min-h-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de seguridad
              </CardTitle>
              <CardDescription>Políticas de seguridad y acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Tiempo de sesión (minutos)</Label>
                    <Input type="number" defaultValue="120" />
                  </div>
                  <div>
                    <Label>Intentos de login fallidos</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Autenticación de dos factores</Label>
                      <p className="text-sm text-muted-foreground">Requerida para administradores</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Política de contraseñas</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Básica (6 caracteres)</SelectItem>
                        <SelectItem value="medium">Media (8 caracteres + números)</SelectItem>
                        <SelectItem value="high">Alta (12 caracteres + símbolos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Logs de auditoría</Label>
                      <p className="text-sm text-muted-foreground">Registrar todas las acciones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Database className="h-5 w-5" />
                Integraciones externas
              </CardTitle>
              <CardDescription>Conecta con servicios externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Google Workspace", status: "Conectado", icon: Mail },
                  { name: "Microsoft Teams", status: "Desconectado", icon: Globe },
                  { name: "Zoom", status: "Conectado", icon: Settings },
                  { name: "Canvas LMS", status: "Desconectado", icon: Database },
                ].map((integration, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium text-card-foreground">{integration.name}</span>
                      </div>
                      <Badge variant={integration.status === "Conectado" ? "default" : "secondary"}>
                        {integration.status}
                      </Badge>
                    </div>
                    <Button
                      variant={integration.status === "Conectado" ? "destructive" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {integration.status === "Conectado" ? "Desconectar" : "Conectar"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
