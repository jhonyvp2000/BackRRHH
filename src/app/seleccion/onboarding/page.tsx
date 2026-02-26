import React from 'react';
import { Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <Construction className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Módulo en Construcción</h1>
      <p className="text-gray-500 max-w-md">
        La página para <strong>seleccion\onboarding</strong> está actualmente en desarrollo. Pronto estará disponible con todas las funcionalidades esperadas.
      </p>
    </div>
  );
}
