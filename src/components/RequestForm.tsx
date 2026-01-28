import { useState } from "react";
import { createRequest } from "../api/requests.api";
import type { CreateRequestPayload } from "../types/request.types";
import { useAuth } from "../auth/useAuth";

interface RequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RequestForm({ onSuccess, onCancel }: RequestFormProps) {
  const { username } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRequestPayload>({
    direccion: "",
    precio: 0,
    num_habitaciones: 1,
    tipo_operacion: "Venta",
    nombre_cliente: username || "",
    email_cliente: username || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Sending request data:', JSON.stringify(formData, null, 2));
      await createRequest(formData);
      onSuccess?.();
    } catch (error: any) {
      console.error("=== REQUEST CREATION ERROR ===");
      console.error("Error object:", error);
      console.error("Response data:", JSON.stringify(error.response?.data, null, 2));
      console.error("Response status:", error.response?.status);
      
      // Show detailed error message
      let errorMessage = 'Error al crear la solicitud.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        errorMessage = 'Errores de validación:\n' + 
                      Object.entries(errors).map(([field, msgs]) => 
                        `- ${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
                      ).join('\n');
      } else if (error.response?.status === 400) {
        errorMessage += ' Datos inválidos o faltantes.';
      }
      
      alert(errorMessage + '\n\nPor favor revise los datos e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "precio" || name === "num_habitaciones" ? Number(value) : value
    }));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Nueva Solicitud</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Dirección del inmueble *
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la dirección completa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Precio ($) *
            </label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Número de habitaciones *
            </label>
            <input
              type="number"
              name="num_habitaciones"
              value={formData.num_habitaciones}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de operación *
          </label>
          <select
            name="tipo_operacion"
            value={formData.tipo_operacion}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Venta">Venta</option>
            <option value="Alquiler">Alquiler</option>
            <option value="Compra">Compra</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Su nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="email_cliente"
              value={formData.email_cliente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="su@email.com"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}