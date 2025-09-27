"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  Users,
  School,
  Settings,
  MessageSquare,
  Calendar,
  Shield,
  FileText,
  Search,
  Bell,
  Activity,
  UserCheck,
} from "lucide-react"
import { MetricsGrid } from "@/components/metrics-grid"
import { InstitutionsOverview } from "@/components/institutions-overview"
import { UserManagement } from "@/components/user-management"
import { ReportsSection } from "@/components/reports-section"
import { GlobalSettings } from "@/components/global-settings"

export function GlobalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <School className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">CSM Educativo</h1>
                <p className="text-xs text-muted-foreground">Panel Global</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar instituciones, usuarios..." className="w-80 pl-10" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">AD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard Global
            </Button>
            <Button
              variant={activeTab === "institutions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("institutions")}
            >
              <School className="mr-2 h-4 w-4" />
              Instituciones
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Gestión de Usuarios
            </Button>
            <Button
              variant={activeTab === "evaluations" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("evaluations")}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Autoevaluaciones
            </Button>
            <Button
              variant={activeTab === "content" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("content")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Contenidos Globales
            </Button>
            <Button
              variant={activeTab === "reports" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <Activity className="mr-2 h-4 w-4" />
              Reportes Avanzados
            </Button>
            <Button
              variant={activeTab === "messages" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Centro de Mensajes
            </Button>
            <Button
              variant={activeTab === "events" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("events")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Eventos Globales
            </Button>
            <Button
              variant={activeTab === "security" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("security")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Seguridad y Accesos
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuraciones
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Dashboard Global</h2>
                  <p className="text-muted-foreground">Visión estratégica de toda la plataforma CSM Educativo</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Tiempo real</Badge>
                  <Button variant="outline" size="sm">
                    Exportar datos
                  </Button>
                </div>
              </div>

              <MetricsGrid />
              <InstitutionsOverview />
            </div>
          )}

          {activeTab === "users" && <UserManagement />}
          {activeTab === "reports" && <ReportsSection />}
          {activeTab === "settings" && <GlobalSettings />}

          {/* Placeholder para otras pestañas */}
          {!["dashboard", "users", "reports", "settings"].includes(activeTab) && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Sección en desarrollo</h3>
                <p className="text-muted-foreground">Esta funcionalidad estará disponible próximamente.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
