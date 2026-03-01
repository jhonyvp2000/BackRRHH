"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
    ArrowLeft, UploadCloud, FileText, FileCheck, FileX,
    CheckCircle, AlertCircle, Clock, Trash2, Download, Eye, EyeOff, Edit2, X, Save
} from 'lucide-react';

export default function DetalleConvocatoria({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [savingEdit, setSavingEdit] = useState(false);

    // File upload state
    const [file, setFile] = useState<File | null>(null);
    const [docTitle, setDocTitle] = useState('');
    const [docType, setDocType] = useState('BASES');

    const { data: session, status } = useSession();

    const canRead = (session?.user as any)?.permissions?.includes('leer:convocatorias');
    const canEdit = (session?.user as any)?.permissions?.includes('editar:convocatorias');
    const canPublish = (session?.user as any)?.permissions?.includes('publicar:convocatorias');
    const canDelete = (session?.user as any)?.permissions?.includes('eliminar:convocatorias');

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        if (!id) return; // Prevent fetching when async params render initially as undefined

        try {
            const res = await fetch(`/api/admin/jobs/${id}`);
            if (res.ok) {
                const data = await res.json();
                setJob(data);
                // Initialize edit form 
                setEditForm({
                    title: data.title,
                    code: data.code,
                    regime: data.regime,
                    department: data.department || '',
                    vacancies: data.vacancies,
                    description: data.description,
                    salary: data.salary || ''
                });
            } else {
                console.error("Job details response not OK: ", res.status);
                // router.push('/seleccion/convocatorias');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingEdit(true);
        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setIsEditing(false);
                await fetchJobDetails();
            } else {
                alert("Error al guardar los cambios.");
            }
        } catch (error) {
            console.error("Error saving edits:", error);
            alert("Error de conexión al guardar.");
        } finally {
            setSavingEdit(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !docTitle) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', docTitle);
        formData.append('documentType', docType);

        try {
            const res = await fetch(`/api/admin/jobs/${id}/documents`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                // Reset form and reload
                setFile(null);
                setDocTitle('');
                setDocType('OTHER');
                await fetchJobDetails();
            } else {
                alert("Error al subir archivo");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handlePublish = async () => {
        const newStatus = job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchJobDetails();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeStage = async (newStage: string) => {
        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentStage: newStage })
            });
            if (res.ok) {
                fetchJobDetails();
            } else {
                alert("Error al actualizar la etapa");
            }
        } catch (error) {
            console.error("Error cambiando fase", error);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) return;

        try {
            const res = await fetch(`/api/admin/jobs/${id}/documents?docId=${docId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchJobDetails();
            } else {
                alert("Error al eliminar el documento");
            }
        } catch (err) {
            console.error("Error deleting document:", err);
            alert("Error de conexión al eliminar");
        }
    };

    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [editDocForm, setEditDocForm] = useState<{ title: string, documentType: string }>({ title: '', documentType: '' });
    const [savingDoc, setSavingDoc] = useState(false);

    const handleToggleVisibility = async (docId: string, currentVisibility: boolean) => {
        try {
            const res = await fetch(`/api/admin/jobs/${id}/documents`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ docId, isPublic: !currentVisibility })
            });

            if (res.ok) {
                await fetchJobDetails();
            } else {
                alert("Error al cambiar la visibilidad del documento.");
            }
        } catch (error) {
            console.error("Error toggling document visibility:", error);
        }
    };

    const handleStartDocEdit = (doc: any) => {
        setEditingDocId(doc.id);
        setEditDocForm({
            title: doc.title,
            documentType: doc.documentType
        });
    };

    const handleCancelDocEdit = () => {
        setEditingDocId(null);
    };

    const handleSaveDocEdit = async (docId: string) => {
        if (!editDocForm.title.trim()) {
            alert("El título no puede estar vacío.");
            return;
        }

        setSavingDoc(true);
        try {
            const res = await fetch(`/api/admin/jobs/${id}/documents`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    docId,
                    title: editDocForm.title,
                    documentType: editDocForm.documentType
                })
            });

            if (res.ok) {
                setEditingDocId(null);
                await fetchJobDetails();
            } else {
                alert("Error al guardar los cambios del documento.");
            }
        } catch (error) {
            console.error("Error saving document edit:", error);
            alert("Error de conexión.");
        } finally {
            setSavingDoc(false);
        }
    };

    const handleDeleteJob = async () => {
        const confirm1 = confirm("⚠️ ADVERTENCIA CRÍTICA ⚠️\n\nEstás a punto de ELIMINAR COMPLETAMENTE esta convocatoria. Esto borrará el expediente, el historial de fases y todos los PDFs adjuntos de la nube.\n\n¿Estás absolutamente seguro de continuar?");
        if (!confirm1) return;

        const confirm2 = prompt(`Para confirmar la eliminación definitiva, escribe el código de la convocatoria: ${job.code}`);
        if (confirm2 !== job.code) {
            alert("El código ingresado no coincide. Eliminación cancelada.");
            return;
        }

        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert("Convocatoria eliminada exitosamente.");
                router.push('/seleccion/convocatorias');
            } else {
                alert("Error al intentar eliminar la convocatoria.");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error de conexión al eliminar la convocatoria.");
        }
    };

    const formatCurrency = (value: string | null) => {
        if (!value) return 'No especificada';
        const num = Number(value.toString().replace(/,/g, ''));
        if (!isNaN(num) && value.toString().trim() !== '') {
            return `S/ ${num.toLocaleString('en-US')}`;
        }
        return value;
    };

    if (loading || status === "loading") return <div className="p-12 text-center text-gray-500">Cargando expediente...</div>;

    if (!canRead) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Acceso Denegado</h2>
                <p className="text-gray-500 mt-2">No tienes los permisos necesarios para ver el expediente de la convocatoria.</p>
                <Link href="/seleccion/convocatorias" className="mt-6 bg-hospital-blue text-white px-6 py-2 rounded-lg">
                    Volver
                </Link>
            </div>
        );
    }

    if (!job) return null;

    if (isEditing) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-3xl">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-hospital-blue" />
                            Editar Detalles de la Convocatoria
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 mb-1">Título del Puesto *</label>
                            <input
                                required
                                type="text"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Código del Proceso *</label>
                            <input
                                required
                                type="text"
                                value={editForm.code}
                                onChange={e => setEditForm({ ...editForm, code: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Área / Dpto. Solicitante</label>
                            <input
                                type="text"
                                value={editForm.department}
                                onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Régimen</label>
                            <select
                                value={editForm.regime}
                                onChange={e => setEditForm({ ...editForm, regime: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none bg-white"
                            >
                                <option value="CAS (D.L. 1057)">CAS (D.L. 1057)</option>
                                <option value="Nombrado (D.L. 276)">Nombrado (D.L. 276)</option>
                                <option value="Privado (D.L. 728)">Régimen Privado (D.L. 728)</option>
                                <option value="Servicio Civil (Ley 30057)">Servicio Civil (Ley 30057)</option>
                                <option value="Múltiple">Múltiple</option>
                                <option value="Proceso Interno">Proceso Interno</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">N° de Vacantes</label>
                            <input
                                type="text"
                                value={editForm.vacancies}
                                onChange={e => setEditForm({ ...editForm, vacancies: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Remuneración (Opcional)</label>
                            <input
                                type="text"
                                value={editForm.salary}
                                onChange={e => setEditForm({ ...editForm, salary: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 mb-1">Descripción / Perfil *</label>
                            <textarea
                                required
                                rows={4}
                                value={editForm.description}
                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none resize-y"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <div>
                                {canDelete && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteJob}
                                        className="px-4 py-2 rounded-lg font-bold text-sm text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar Expediente...
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 rounded-lg font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingEdit}
                                    className="px-6 py-2 rounded-lg font-bold text-sm bg-hospital-blue text-white hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {savingEdit ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto max-w-5xl px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <Link href="/seleccion/convocatorias" className="inline-flex items-center gap-2 text-hospital-blue font-bold text-sm hover:underline mb-2">
                            <ArrowLeft className="w-4 h-4" /> Volver a las Convocatorias
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{job.code}</h1>
                            {job.status === 'PUBLISHED' ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">VISIBILIDAD PÚBLICA</span>
                            ) : (
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Borrador Interno</span>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{job.title}</p>
                    </div>
                    <div className="flex gap-3">
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 mr-2 rounded-lg text-gray-400 hover:text-hospital-blue hover:bg-blue-50 transition-colors border border-transparent"
                                title="Editar Datos de Convocatoria"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                        {canPublish && (
                            <button
                                onClick={handlePublish}
                                className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border ${job.status === 'PUBLISHED'
                                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                                    }`}
                            >
                                {job.status === 'PUBLISHED' ? (
                                    <>Ocultar del Portal Público</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Publicar Oficialmente</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Stage Progress Bar (HR) */}
                <div className="bg-gray-50 border-t border-b border-gray-200 overflow-x-auto">
                    <div className="container mx-auto max-w-5xl px-6 py-3 flex gap-2 min-w-max">
                        {[
                            { id: 'PREPARATORIA', label: '1. Preparatoria' },
                            { id: 'CONVOCATORIA', label: '2. Convocatoria' },
                            { id: 'EVALUACION_CURRICULAR', label: '3. Ev. Curricular' },
                            { id: 'ENTREVISTAS', label: '4. Entrevistas' },
                            { id: 'CONCLUIDO', label: '5. Concluido' }
                        ].map((stage) => (
                            <button
                                key={stage.id}
                                onClick={() => handleChangeStage(stage.id)}
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors border ${job.currentStage === stage.id
                                    ? 'bg-hospital-blue text-white border-hospital-blue'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {stage.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Col: Upload Form */}
                <div className="md:col-span-1 space-y-6">
                    {canEdit && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-hospital-blue" />
                                Nuevo Documento
                            </h3>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nombre Público del Archivo</label>
                                    <input
                                        type="text"
                                        required
                                        value={docTitle}
                                        onChange={(e) => setDocTitle(e.target.value)}
                                        placeholder="Ej: Bases Integradas"
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Fase / Tipo</label>
                                    <select
                                        value={docType}
                                        onChange={(e) => setDocType(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-hospital-blue outline-none text-sm"
                                    >
                                        <option value="BASES">Bases y Anexos</option>
                                        <option value="RESULTS_PRE">Resultados Curriculares</option>
                                        <option value="COMMUNIQUE">Comunicado / Fe de erratas</option>
                                        <option value="RESULTS_FINAL">Resultados Finales (Ganadores)</option>
                                        <option value="OTHER">Otros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Archivo PDF</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        required
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-hospital-blue hover:file:bg-blue-100"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Solo PDF, máx. 5MB recomendados.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-hospital-blue text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Metadata Card */}
                    <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-3 text-sm">Resumen del Expediente</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><strong className="text-gray-800">Régimen:</strong> {job.regime}</li>
                            <li><strong className="text-gray-800">Vacantes:</strong> {job.vacancies}</li>
                            <li><strong className="text-gray-800">Remuneración:</strong> {formatCurrency(job.salary)}</li>
                            <li><strong className="text-gray-800">Fecha Creado:</strong> {new Date(job.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>
                </div>

                {/* Right Col: Documents Timeline */}
                <div className="md:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-6 text-lg">Archivos Adjuntos al Expediente</h3>

                    {job.documents && job.documents.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <FileX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h4 className="text-gray-800 font-medium">Aún no hay archivos subidos</h4>
                            <p className="text-sm text-gray-500 mt-1 text-balance">Usa el formulario lateral para agregar las Bases del Concurso o los Anexos.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {[
                                { group: 'Bases y Anexos', types: ['BASES'] },
                                { group: 'Evaluación Curricular', types: ['RESULTS_PRE'] },
                                { group: 'Conocimientos / Entrevistas', types: ['COMMUNIQUE'] },
                                { group: 'Resultados Finales', types: ['RESULTS_FINAL'] },
                                { group: 'Otros Documentos', types: ['OTHER'] },
                            ].map(({ group, types }) => {
                                const groupDocs = job.documents.filter((d: any) => types.includes(d.documentType));
                                if (groupDocs.length === 0) return null;

                                return (
                                    <div key={group} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <h4 className="font-bold text-gray-800 text-sm mb-4 border-b pb-2">{group}</h4>
                                        <div className="space-y-3">
                                            {groupDocs.map((doc: any) => (
                                                <div key={doc.id} className={`flex items-center justify-between group p-2 rounded-lg transition-colors ${!doc.isPublic ? 'bg-gray-50 border border-gray-200/60' : 'hover:bg-gray-50'}`}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <FileText className={`w-5 h-5 shrink-0 ${!doc.isPublic ? 'text-gray-400' : 'text-red-500'}`} />

                                                        {editingDocId === doc.id ? (
                                                            <div className="flex-1 flex flex-col md:flex-row gap-2 items-start md:items-center py-1">
                                                                <input
                                                                    type="text"
                                                                    value={editDocForm.title}
                                                                    onChange={(e) => setEditDocForm({ ...editDocForm, title: e.target.value })}
                                                                    className="px-2 py-1 text-sm border border-hospital-blue rounded outline-none w-full max-w-xs focus:ring-1 focus:ring-hospital-blue"
                                                                    autoFocus
                                                                />
                                                                <select
                                                                    value={editDocForm.documentType}
                                                                    onChange={(e) => setEditDocForm({ ...editDocForm, documentType: e.target.value })}
                                                                    className="px-2 py-1 text-sm border border-gray-300 rounded outline-none"
                                                                >
                                                                    <option value="BASES">Bases y Anexos</option>
                                                                    <option value="RESULTS_PRE">Resultados Curriculares</option>
                                                                    <option value="COMMUNIQUE">Comunicado / Fe de erratas</option>
                                                                    <option value="RESULTS_FINAL">Resultados Finales</option>
                                                                    <option value="OTHER">Otros</option>
                                                                </select>

                                                                <div className="flex items-center gap-1 ml-auto">
                                                                    <button
                                                                        onClick={() => handleSaveDocEdit(doc.id)}
                                                                        disabled={savingDoc}
                                                                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                                        title="Guardar Cambios"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelDocEdit}
                                                                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                                                                        title="Cancelar"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h5 className={`font-medium text-sm transition-colors ${!doc.isPublic ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-800 group-hover:text-hospital-blue'}`}>
                                                                        {doc.title}
                                                                    </h5>
                                                                    {!doc.isPublic && (
                                                                        <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">OCULTO</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(doc.uploadedAt).toLocaleString('es-PE')}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {editingDocId !== doc.id && (
                                                        <div className="flex items-center gap-1 ml-4">
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => handleStartDocEdit(doc)}
                                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                                    title="Editar Nombre o Fase"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => handleToggleVisibility(doc.id, doc.isPublic)}
                                                                    className={`p-1.5 rounded-lg transition-colors ${doc.isPublic ? 'text-blue-500 hover:bg-blue-100 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}
                                                                    title={doc.isPublic ? "Ocultar documento" : "Mostrar documento"}
                                                                >
                                                                    {doc.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                </button>
                                                            )}
                                                            <a
                                                                href={doc.documentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 text-gray-400 hover:text-hospital-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Descargar"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
