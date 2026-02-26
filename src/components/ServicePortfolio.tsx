'use client';

import React, { useState } from 'react';
import {
    Siren, HeartPulse, Stethoscope, Microscope, Box, Bed,
    Activity, TestTube, Scan, Users, Pill, Leaf, Baby, Brain
} from 'lucide-react';

type ServiceItem = {
    name: string;
    details?: string[];
};

type ServiceCategory = {
    id: string;
    label: string;
    icon: React.ElementType;
    subcategories: {
        title: string;
        items: ServiceItem[];
    }[];
};

const SERVICE_DATA: ServiceCategory[] = [
    {
        id: 'criticos',
        label: 'Emergencia y Críticos',
        icon: Siren,
        subcategories: [
            {
                title: 'Emergencia',
                items: [
                    { name: 'Triaje en Emergencia' },
                    { name: 'Tópico de Inyectables y Nebulizaciones' },
                    { name: 'Emergencias y Desastres' },
                    { name: 'Unidad de Shock Trauma y Reanimación' },
                    { name: 'Sala de Observación' },
                ]
            },
            {
                title: 'Cuidados Intensivos (UCI)',
                items: [
                    { name: 'Cuidados Intensivos General' },
                    { name: 'Cuidados Intensivos Pediátrico' },
                    { name: 'Cuidados Intensivos Neonatal' },
                    { name: 'Cuidados Intermedios Neonatal' },
                ]
            },
            {
                title: 'Centro Quirúrgico',
                items: [
                    { name: 'Cirugía General', details: ['Cabeza, Cuello y Maxilofacial', 'Oncológica', 'Pediátrica'] },
                    { name: 'Neurocirugía' },
                    { name: 'Oftalmología' },
                    { name: 'Ortopedia y Traumatología' },
                    { name: 'Otorrinolaringología' },
                    { name: 'Urología' },
                    { name: 'Sala de Recuperación Post Anestésica' },
                ]
            },
            {
                title: 'Centro Obstétrico',
                items: [
                    { name: 'Atención de Parto' },
                    { name: 'Ginecología y Obstetricia' },
                    { name: 'Monitoreo de Gestantes' },
                    { name: 'Atención Inmediata del Recién Nacido' },
                ]
            }
        ]
    },
    {
        id: 'ambulatoria',
        label: 'Consulta Externa',
        icon: Stethoscope,
        subcategories: [
            {
                title: 'Consulta Externa (Especialidades)',
                items: [
                    { name: 'Medicina Interna', details: ['Nefrología', 'Neurología', 'Cardiología', 'Psiquiatría', 'Reumatología', 'Infectología', 'Endocrinología', 'Gastroenterología', 'Neumología', 'Geriatría', 'Medicina Oncológica'] },
                    { name: 'Cirugía', details: ['General', 'Cabeza y Cuello', 'Oncológica', 'Pediátrica', 'Neurocirugía', 'Oftalmología', 'Traumatología', 'Otorrinolaringología', 'Urología'] },
                    { name: 'Pediatría y Neonatología' },
                    { name: 'Ginecología y Obstetricia' },
                    { name: 'Anestesiología' },
                    { name: 'Dermatología' },
                    { name: 'Odontología' },
                    { name: 'Psicología' },
                    { name: 'Nutrición' },
                ]
            },
            {
                title: 'Medicina de Rehabilitación',
                items: [
                    { name: 'Terapia Física (Discapacidad Leve, Moderada y Severa)' },
                    { name: 'Terapia Respiratoria' },
                    { name: 'Terapia de Lenguaje' },
                    { name: 'Terapia de Aprendizaje' },
                ]
            },
            {
                title: 'Nutrición y Dietética',
                items: [
                    { name: 'Evaluación Nutricional' },
                    { name: 'Soporte Nutricional' },
                    { name: 'Fórmulas Lácteas y Enterales' },
                ]
            },
            {
                title: 'Actividad de Diálisis',
                items: [
                    { name: 'Diálisis Peritoneal' },
                ]
            }
        ]
    },
    {
        id: 'diagnostico',
        label: 'Ayuda al Diagnóstico',
        icon: Microscope,
        subcategories: [
            {
                title: 'Diagnóstico por Imágenes',
                items: [
                    { name: 'Radiología Convencional y Especializada' },
                    { name: 'Radiología Intervencionista' },
                    { name: 'Angiografía' },
                    { name: 'Ecografía General y Doppler' },
                    { name: 'Mamografía' },
                    { name: 'Densitometría Ósea' },
                    { name: 'Tomografía Computada' },
                    { name: 'Resonancia Magnética' },
                ]
            },
            {
                title: 'Patología Clínica',
                items: [
                    { name: 'Procedimientos de Laboratorio Clínico' },
                ]
            },
            {
                title: 'Anatomía Patológica',
                items: [
                    { name: 'Procedimientos de Anatomía Patológica' },
                ]
            }
        ]
    },
    {
        id: 'soporte',
        label: 'Soporte Prestacional',
        icon: Box,
        subcategories: [
            {
                title: 'Farmacia',
                items: [
                    { name: 'Dispensación de Productos Farmacéuticos' },
                    { name: 'Farmacia Clínica' },
                    { name: 'Farmacotecnia' },
                ]
            },
            {
                title: 'Banco de Sangre Tipo I A',
                items: [
                    { name: 'Provisión de Hemocomponentes' },
                ]
            },
            {
                title: 'Central de Esterilización',
                items: [
                    { name: 'Desinfección de Alto Nivel' },
                    { name: 'Esterilización (Físicos y Químicos)' },
                ]
            }
        ]
    },
    {
        id: 'hospitalizacion',
        label: 'Hospitalización',
        icon: Bed,
        subcategories: [
            {
                title: 'Hospitalización General',
                items: [
                    { name: 'Medicina Interna' },
                    { name: 'Cirugía General' },
                    { name: 'Pediatría' },
                    { name: 'Ginecología y Obstetricia' },
                    { name: 'Sub Especialidades Médicas y Quirúrgicas' },
                    { name: 'Monitoreo de Gestantes con Complicaciones' },
                ]
            }
        ]
    }
];

export default function ServicePortfolio() {
    const [activeTab, setActiveTab] = useState(SERVICE_DATA[0].id);

    const activeCategory = SERVICE_DATA.find(cat => cat.id === activeTab);

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-hospital-blue mb-4">Cartera de Servicios</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Contamos con una amplia oferta prestacional organizada para atender todas tus necesidades de salud.
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {SERVICE_DATA.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeTab === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300
                                    ${isActive
                                        ? 'bg-hospital-blue text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                {category.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeCategory?.subcategories.map((sub, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-blue-50/50 p-4 border-b border-blue-100">
                                <h3 className="font-bold text-lg text-hospital-blue">{sub.title}</h3>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {sub.items.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 text-sm">
                                            <div className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                                                <div>
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                    {item.details && (
                                                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                                                            {item.details.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-gray-500 italic">
                        * La disponibilidad de servicios puede variar. Para citas, por favor contacte a Admisión o use nuestra plataforma digital.
                    </p>
                </div>
            </div>
        </section>
    );
}
