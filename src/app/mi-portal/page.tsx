"use client";

import React from 'react';
import {
    FileText, User, Users, Calendar, Clock,
    GraduationCap, Bell, LogOut, Settings,
    Download, Activity, Stethoscope
} from 'lucide-react';
import Link from 'next/link';

import { signOut } from 'next-auth/react';

export default function IntranetDashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50">

            {/* Top Navigation */}
            <nav className="bg-hospital-blue text-white px-6 py-4 shadow-md sticky top-0 z-50">
                <div className="container mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Intranet Colaboradores</h1>
                            <p className="text-xs opacity-80">Hospital Referencial San Martín</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="font-bold text-sm">Dr. Juan Pérez</span>
                            <span className="text-xs opacity-80">Médico Internista - CMP 12345</span>
                        </div>
                        <div className="h-10 w-10 bg-white text-hospital-blue rounded-full flex items-center justify-center font-bold border-2 border-white/20">
                            JP
                        </div>
                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg transition-colors" title="Cerrar Sesión">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto max-w-7xl px-6 py-8">

                {/* Welcome & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-r from-blue-800 to-hospital-blue rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-2">¡Buenos días, Juan! 👋</h2>
                                <p className="opacity-90 mb-6 max-w-lg">
                                    Tienes <strong>2 capacitaciones pendientes</strong> para este mes y tu rol de guardias de Marzo ya está publicado.
                                </p>
                                <div className="flex gap-3">
                                    <button className="bg-white text-hospital-blue px-4 py-2 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all">
                                        Ver Mis Guardias
                                    </button>
                                    <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-all border border-blue-500">
                                        Ir al Campus Virtual
                                    </button>
                                </div>
                            </div>
                            {/* Decor */}
                            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-yellow-500" /> Avisos
                            </h3>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">3 Nuevos</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="text-sm text-gray-600 border-l-2 border-hospital-blue pl-3 py-1">
                                <span className="block font-bold text-gray-800 text-xs">Hoy, 09:00 AM</span>
                                Suspensión de agua programada en Pabellón B.
                            </li>
                            <li className="text-sm text-gray-600 border-l-2 border-green-500 pl-3 py-1">
                                <span className="block font-bold text-gray-800 text-xs">Ayer</span>
                                Llegada de nuevos equipos de rayos X.
                            </li>
                        </ul>
                        <button className="text-hospital-blue text-xs font-bold mt-4 hover:underline text-center w-full">Ver todos los comunicados</button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <h3 className="text-xl font-bold text-gray-800 mb-6">Accesos Directos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                    {/* Module: Recursos Humanos */}
                    <DashboardCard title="Gestión de RR.HH.">
                        <Link href="/seleccion/convocatorias">
                            <MenuItem icon={FileText} text="Convocatorias de Personal" subtext="Registra procesos de selección" active />
                        </Link>
                        <MenuItem icon={User} text="Mi Legajo Digital" subtext="Resoluciones y contratos" />
                        <MenuItem icon={Clock} text="Marcaciones" subtext="Historial de asistencia" />
                        <MenuItem icon={Calendar} text="Solicitud de Vacaciones" subtext="Programación anual" />
                    </DashboardCard>

                    {/* Module: Asistencial */}
                    <DashboardCard title="Operatividad Asistencial">
                        <MenuItem icon={Stethoscope} text="Rol de Guardias" subtext="Marzo 2024 - Aprobado" active />
                        <MenuItem icon={Activity} text="Censo Hospitalario" subtext="Disponibilidad de camas en tiempo real" />
                        <MenuItem icon={Users} text="Interconsultas" subtext="6 pendientes de respuesta" badge="6" />
                    </DashboardCard>

                    {/* Module: Capacitación */}
                    <DashboardCard title="Desarrollo y Bienestar">
                        <MenuItem icon={GraduationCap} text="Campus Virtual" subtext="Cursos obligatorios MINSA" />
                        <MenuItem icon={Download} text="Formatos Institucionales" subtext="FUT, Permisos, Licencias" />
                        <MenuItem icon={Settings} text="Actualizar Datos" subtext="Correo, Teléfono, Dirección" />
                    </DashboardCard>

                </div>
            </div>
        </main>
    );
}

function DashboardCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h4 className="font-bold text-gray-700">{title}</h4>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, text, subtext, badge, active }: { icon: React.ElementType, text: string, subtext: string, badge?: string, active?: boolean }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-hospital-blue text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-hospital-blue'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h5 className="font-bold text-gray-800 text-sm">{text}</h5>
                    {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                </div>
                <p className="text-xs text-gray-500">{subtext}</p>
            </div>
        </div>
    )
}
