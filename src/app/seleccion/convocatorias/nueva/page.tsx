"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    ArrowLeft, Save, FileText, CheckCircle
} from 'lucide-react';

export default function NuevaConvocatoriaPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canCreate = (session?.user as any)?.permissions?.includes('create:convocatorias');

    if (status === "loading") return null;
    if (!canCreate && status === "authenticated") {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <FileText className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Acceso Denegado</h2>
                <p className="text-gray-500 mt-2">No tienes los permisos necesarios para crear convocatorias.</p>
                <Link href="/seleccion/convocatorias" className="mt-6 bg-hospital-blue text-white px-6 py-2 rounded-lg">
                    Volver
                </Link>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        regime: 'CAS',
        department: '',
        vacancies: '1',
        description: '',
        salary: '',
        status: 'DRAFT'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect exactly to the newly created record layout to attach docs
                router.push(`/seleccion/convocatorias/${data.id}`);
            } else {
                const err = await res.json();
                setError(err.error || 'Error al guardar el proceso');
            }
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error de red. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header / Sub-nav */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto max-w-4xl px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <Link href="/seleccion/convocatorias" className="inline-flex items-center gap-2 text-hospital-blue font-bold text-sm hover:underline mb-2">
                            <ArrowLeft className="w-4 h-4" /> Volver a la Lista
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <FileText className="w-7 h-7 text-hospital-blue" />
                            Nueva Convocatoria Laboral
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Registra los datos iniciales del proceso. En el siguiente paso podrás adjuntar las Bases (PDF).</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-6 py-8 flex-1">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                        <p className="font-bold">Error al crear</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Column 1 */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Código del Proceso *</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="Ej: CAS N° 001-2024-MINSA"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                    />
                                    <span className="text-xs text-gray-500 mt-1 block">El identificador oficial del concurso.</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Título del Puesto *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ej: Médico Cirujano Especialista en Traumatología"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Área / Dpto. Solicitante *</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Ej: Departamento de Pediatría"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Régimen *</label>
                                        <select
                                            name="regime"
                                            value={formData.regime}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none bg-white"
                                        >
                                            <option value="">Seleccione el régimen...</option>
                                            <option value="CAS (D.L. 1057)">CAS (D.L. 1057)</option>
                                            <option value="Nombrados (D.L. 276)">Nombrados (D.L. 276)</option>
                                            <option value="Privado (D.L. 728)">Régimen Privado (D.L. 728)</option>
                                            <option value="Servicio Civil (Ley 30057)">Servicio Civil (Ley 30057)</option>
                                            <option value="Múltiple">Múltiple</option>
                                            <option value="Proceso Interno">Proceso Interno</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">N° Vacantes *</label>
                                        <input
                                            type="text"
                                            name="vacancies"
                                            value={formData.vacancies}
                                            onChange={handleChange}
                                            placeholder="1"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Descripción Breve / Área *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Breve resumen del perfil requerido o el área donde laborará el profesional..."
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Sueldo / Remuneración</label>
                                        <input
                                            type="text"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            placeholder="S/ 0.00"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Estado de la Publicación</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hospital-blue focus:border-transparent transition-all outline-none"
                                        >
                                            <option value="DRAFT">Borrador (Oculto)</option>
                                            <option value="PUBLISHED">Publicado (Visible)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                            <Link
                                href="/seleccion/convocatorias"
                                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-hospital-blue text-white px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar y Continuar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
