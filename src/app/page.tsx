import React from 'react';
import { Users, Clock, TrendingUp, Building2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido a Back RRHH</h1>
          <p className="text-gray-500 mt-1">Panel de control principal del Sistema Integrado de Recursos Humanos</p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
          <Clock className="h-5 w-5" />
          <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Colaboradores Activos"
          value="1,432"
          trend="+12 este mes"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Asistencia Hoy"
          value="94%"
          trend="En línea con el promedio"
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          title="Licencias Médicas"
          value="38"
          trend="-5 respecto a la semana anterior"
          icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard
          title="Presupuesto Ejecutado"
          value="42%"
          trend="Planilla Marzo"
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      {/* Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Atajos Rápidos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            Accesos Directos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ShortcutButton title="Registrar Alta" delay="0ms" />
            <ShortcutButton title="Procesar Boletas" delay="100ms" />
            <ShortcutButton title="Ver Marcaciones" delay="200ms" />
            <ShortcutButton title="Nueva Convocatoria" delay="300ms" />
            <ShortcutButton title="Reporte Asistencia" delay="400ms" />
            <ShortcutButton title="Asignar Turnos" delay="500ms" />
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avisos Importantes</h2>
          <div className="space-y-4">
            <NotificationItem
              title="Cierre de Planilla"
              desc="Quedan 3 días para el cierre de la planilla del régimen CAS."
              time="Hace 2 horas"
              type="warning"
            />
            <NotificationItem
              title="Actualización de Legajos"
              desc="45 colaboradores pendientes de actualizar su declaración jurada."
              time="Hoy, 09:00 AM"
              type="info"
            />
            <NotificationItem
              title="Convocatoria 004-2024"
              desc="Fase de entrevistas concluida exitosamente."
              time="Ayer"
              type="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, trend, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{trend}</p>
      </div>
      <div className={`${color} p-3 rounded-xl`}>
        {icon}
      </div>
    </div>
  );
}

function ShortcutButton({ title, delay }: any) {
  return (
    <button
      className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all text-sm font-medium text-gray-700 hover:shadow-sm text-center border border-transparent hover:border-blue-100"
      style={{ animationDelay: delay }}
    >
      {title}
    </button>
  );
}

function NotificationItem({ title, desc, time, type }: any) {
  const colors = {
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
    success: "bg-emerald-100 text-emerald-600"
  };

  return (
    <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${colors[type as keyof typeof colors].replace('bg-', 'bg-').split(' ')[0]}`} />
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
        <p className="text-[10px] text-gray-400 mt-2">{time}</p>
      </div>
    </div>
  );
}
