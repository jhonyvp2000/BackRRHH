"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Users, Clock, CalendarClock,
    DollarSign, FileText, Briefcase, GraduationCap,
    TrendingUp, Activity, ShieldPlus, Settings,
    ShieldCheck, LayoutDashboard, ChevronDown
} from 'lucide-react';

const MENU_DATA = [
    {
        title: 'Organización',
        icon: Building2,
        href: '/legajo',
        description: 'Gestión de datos de empleados y organigrama.',
        submodules: [
            { title: 'Datos Personales', href: '/legajo/datos-personales', icon: Users },
            { title: 'Estructura Organizacional', href: '/legajo/estructura', icon: Building2 },
            { title: 'Historial Laboral', href: '/legajo/historial', icon: FileText },
        ]
    },
    {
        title: 'Asistencia',
        icon: Clock,
        href: '/asistencia',
        description: 'Control de marcaciones, horarios y permisos.',
        submodules: [
            { title: 'Marcaciones', href: '/asistencia/marcaciones', icon: Clock },
            { title: 'Turnos y Horarios', href: '/asistencia/turnos', icon: CalendarClock },
            { title: 'Licencias y Vacaciones', href: '/asistencia/licencias', icon: CalendarClock },
        ]
    },
    {
        title: 'Nómina',
        icon: DollarSign,
        href: '/nomina',
        description: 'Cálculo de pagos y emisión de boletas.',
        submodules: [
            { title: 'Conceptos Remunerativos', href: '/nomina/conceptos', icon: Settings },
            { title: 'Procesamiento Planilla', href: '/nomina/procesamiento', icon: TrendingUp },
            { title: 'Boletas de Pago', href: '/nomina/boletas', icon: FileText },
        ]
    },
    {
        title: 'Selección',
        icon: Briefcase,
        href: '/seleccion',
        description: 'Gestión de convocatorias CAS y onboarding.',
        submodules: [
            { title: 'Convocatorias', href: '/seleccion/convocatorias', icon: Briefcase },
            { title: 'Evaluación de Postulantes', href: '/seleccion/evaluacion', icon: Users },
            { title: 'Onboarding', href: '/seleccion/onboarding', icon: ShieldCheck },
        ]
    },
    {
        title: 'Desempeño',
        icon: TrendingUp,
        href: '/desempeno',
        description: 'POI, evaluaciones anuales y cursos.',
        submodules: [
            { title: 'Metas y POI', href: '/desempeno/metas', icon: Activity },
            { title: 'Evaluaciones', href: '/desempeno/evaluaciones', icon: TrendingUp },
            { title: 'Capacitaciones', href: '/desempeno/capacitaciones', icon: GraduationCap },
        ]
    },
    {
        title: 'Bienestar',
        icon: ShieldPlus,
        href: '/bienestar',
        description: 'Seguridad, salud y prevención de riesgos.',
        submodules: [
            { title: 'Seguridad Ocupacional', href: '/bienestar/sso', icon: ShieldPlus },
            { title: 'Descansos Médicos', href: '/bienestar/descansos', icon: Activity },
        ]
    },
    {
        title: 'Configuración',
        icon: Settings,
        href: '/configuracion',
        description: 'Ajustes, roles y auditoría estatal.',
        submodules: [
            { title: 'Usuarios y Roles', href: '/configuracion/usuarios', icon: Users },
            { title: 'Auditoría', href: '/configuracion/auditoria', icon: ShieldCheck },
            { title: 'Parámetros Generales', href: '/configuracion/parametros', icon: Settings },
        ]
    }
];

export function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (index: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenu(index);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
        }, 200); // Pequeño retraso para que el usuario pueda mover el mouse al submenu
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <nav className="relative z-50 bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <LayoutDashboard className="h-6 w-6 text-white" />
                        </div>
                        <Link href="/" className="flex flex-col">
                            <span className="font-bold text-xl text-gray-900 tracking-tight leading-none">
                                Back <span className="text-blue-600">RRHH</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
                                OGESS Tarapoto
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1" onMouseLeave={handleMouseLeave}>
                        {MENU_DATA.map((menu, index) => {
                            const Icon = menu.icon;
                            const isActive = activeMenu === index;

                            return (
                                <div
                                    key={menu.title}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                >
                                    <button
                                        className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium
                      ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {menu.title}
                                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                            >
                                                <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <Icon className="h-5 w-5 text-blue-600" />
                                                        {menu.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {menu.description}
                                                    </p>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    {menu.submodules.map((subItem) => {
                                                        const SubIcon = subItem.icon;
                                                        return (
                                                            <Link
                                                                key={subItem.title}
                                                                href={subItem.href}
                                                                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                                onClick={() => setActiveMenu(null)}
                                                            >
                                                                <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all text-gray-400">
                                                                    <SubIcon className="h-4 w-4" />
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                                                    {subItem.title}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
