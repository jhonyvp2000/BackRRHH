"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Filter, FileText,
    MoreVertical, Edit, FileDown,
    Trash2, ExternalLink
} from 'lucide-react';

import { useSession } from 'next-auth/react';

interface JobPosting {
    id: string;
    title: string;
    code: string;
    regime: string;
    vacancies: string;
    status: string;
    publicationDate: string;
}

export default function ConvocatoriasDashboard() {
    const { data: session } = useSession();
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);

    const canCreate = (session?.user as any)?.permissions?.includes('crear:convocatorias');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/admin/jobs');
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Publicado</span>;
            case 'DRAFT': return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">Borrador</span>;
            case 'IN_EVALUATION': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">En Evaluación</span>;
            case 'CLOSED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Finalizado</span>;
            case 'CANCELLED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold line-through">Anulado</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Sub-nav */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto max-w-7xl px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Link href="/mi-portal" className="hover:text-hospital-blue transition-colors">Dashboard</Link>
                                <span>/</span>
                                <span className="text-gray-800 font-medium">Recursos Humanos</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="w-7 h-7 text-hospital-blue" />
                                Gestión de Convocatorias Laborales
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Registra y administra los procesos de selección activos (CAS, 276, etc.)</p>
                        </div>
                        {canCreate && (
                            <Link
                                href="/seleccion/convocatorias/nueva"
                                className="bg-hospital-blue text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                Nuevo Proceso
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6 py-8 flex-1">
                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código (ej. CAS N° 001) o título..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors bg-white">
                            <Filter className="w-4 h-4" />
                            Régimen
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors bg-white">
                            <Filter className="w-4 h-4" />
                            Estado
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                    <th className="font-bold text-gray-600 px-6 py-4">CÓDIGO / TÍTULO</th>
                                    <th className="font-bold text-gray-600 px-6 py-4">RÉGIMEN</th>
                                    <th className="font-bold text-gray-600 px-6 py-4 text-center">VACANTES</th>
                                    <th className="font-bold text-gray-600 px-6 py-4">ESTADO</th>
                                    <th className="font-bold text-gray-600 px-6 py-4">FECHA PUB.</th>
                                    <th className="font-bold text-gray-600 px-6 py-4 text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-blue"></div>
                                            </div>
                                            Cargando procesos...
                                        </td>
                                    </tr>
                                ) : jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No hay convocatorias registradas</p>
                                            <p className="text-sm mt-1">Crea un "Nuevo Proceso" para comenzar a recibir postulantes.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-hospital-blue text-sm">{job.code}</div>
                                                <div className="text-gray-900 font-medium line-clamp-1">{job.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded border border-gray-200">
                                                    {job.regime}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-gray-700">{job.vacancies}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(job.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {new Date(job.publicationDate).toLocaleDateString('es-PE')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/seleccion/convocatorias/${job.id}`} className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Editar Expediente">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <a href={`/convocatorias/${job.id}`} target="_blank" className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors" title="Ver Público">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    {!loading && jobs.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Mostrando <span className="font-bold text-gray-900">{jobs.length}</span> registros</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-200 text-gray-400 rounded cursor-not-allowed text-sm font-medium">Anterior</button>
                                <button className="px-3 py-1 bg-white border border-gray-200 text-hospital-blue rounded hover:bg-gray-50 text-sm font-medium transition-colors">Siguiente</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
