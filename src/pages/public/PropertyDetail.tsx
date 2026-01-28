import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../../api/properties.api";
import { createRequest } from "../../api/requests.api";
import { createAppointment } from "../../api/appointments.api";
import type { Property } from "../../types/property.types";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [appointmentStatus, setAppointmentStatus] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState({
    nombre_cliente: "",
    email_cliente: "",
    tipo_operacion: "Venta",
    num_habitaciones: "",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    clientName: "",
    email: "",
    appointmentDate: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      getPropertyById(Number(id)).then(setProperty);
    }
  }, [id]);

  if (!property) return <p className="p-6">Cargando...</p>;

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus(null);

    const payload = {
      direccion: property.address,
      precio: property.price,
      num_habitaciones: Number(requestForm.num_habitaciones),
      tipo_operacion: requestForm.tipo_operacion,
      nombre_cliente: requestForm.nombre_cliente.trim(),
      email_cliente: requestForm.email_cliente.trim(),
    };

    if (!payload.nombre_cliente || !payload.email_cliente || !payload.num_habitaciones) {
      setRequestStatus("Completa todos los campos de solicitud.");
      return;
    }

    try {
      await createRequest(payload);
      setRequestStatus("Solicitud enviada correctamente.");
      setRequestForm({
        nombre_cliente: "",
        email_cliente: "",
        tipo_operacion: "Venta",
        num_habitaciones: "",
      });
    } catch {
      setRequestStatus("No se pudo enviar la solicitud.");
    }
  };

  const submitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentStatus(null);

    if (
      !appointmentForm.clientName.trim() ||
      !appointmentForm.email.trim() ||
      !appointmentForm.appointmentDate.trim() ||
      !appointmentForm.description.trim()
    ) {
      setAppointmentStatus("Completa todos los campos de la cita.");
      return;
    }

    const appointmentDateIso = new Date(
      appointmentForm.appointmentDate
    ).toISOString();

    try {
      await createAppointment({
        clientName: appointmentForm.clientName.trim(),
        email: appointmentForm.email.trim(),
        appointmentDate: appointmentDateIso,
        description: appointmentForm.description.trim(),
      });
      setAppointmentStatus("Cita registrada correctamente.");
      setAppointmentForm({
        clientName: "",
        email: "",
        appointmentDate: "",
        description: "",
      });
    } catch {
      setAppointmentStatus("No se pudo registrar la cita.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-3xl font-bold break-words">{property.title}</h1>
        <p className="text-slate-600 break-words">{property.address}</p>
        <p className="mt-4 text-slate-700 break-words">{property.description}</p>
        <p className="text-xl font-bold mt-4">${property.price}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={submitRequest}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold">Solicitar información</h2>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            placeholder="Nombre"
            value={requestForm.nombre_cliente}
            onChange={(e) =>
              setRequestForm({ ...requestForm, nombre_cliente: e.target.value })
            }
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            type="email"
            placeholder="Correo"
            value={requestForm.email_cliente}
            onChange={(e) =>
              setRequestForm({ ...requestForm, email_cliente: e.target.value })
            }
          />
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            value={requestForm.tipo_operacion}
            onChange={(e) =>
              setRequestForm({ ...requestForm, tipo_operacion: e.target.value })
            }
          >
            <option value="Venta">Venta</option>
            <option value="Alquiler">Alquiler</option>
          </select>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            type="number"
            min={1}
            placeholder="Número de habitaciones"
            value={requestForm.num_habitaciones}
            onChange={(e) =>
              setRequestForm({ ...requestForm, num_habitaciones: e.target.value })
            }
          />
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 self-start">
            Enviar solicitud
          </button>
          {requestStatus && (
            <p className="text-sm text-slate-600 break-words">{requestStatus}</p>
          )}
        </form>

        <form
          onSubmit={submitAppointment}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold">Agendar cita</h2>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            placeholder="Nombre"
            value={appointmentForm.clientName}
            onChange={(e) =>
              setAppointmentForm({ ...appointmentForm, clientName: e.target.value })
            }
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            type="email"
            placeholder="Correo"
            value={appointmentForm.email}
            onChange={(e) =>
              setAppointmentForm({ ...appointmentForm, email: e.target.value })
            }
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            type="datetime-local"
            value={appointmentForm.appointmentDate}
            onChange={(e) =>
              setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })
            }
          />
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-cyan-400 min-w-0"
            placeholder="Mensaje"
            value={appointmentForm.description}
            onChange={(e) =>
              setAppointmentForm({ ...appointmentForm, description: e.target.value })
            }
            rows={3}
          />
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 self-start">
            Agendar cita
          </button>
          {appointmentStatus && (
            <p className="text-sm text-slate-600 break-words">{appointmentStatus}</p>
          )}
        </form>
      </div>
    </div>
  );
}
