import { useEffect, useState } from "react";
import type { Property } from "../../types/property.types";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../api/properties.api";
import { uploadImage } from "../../api/images.api";
import { Building2, ChevronLeft, ChevronRight, ImagePlus, Loader2, Pencil, Plus, Trash2, MapPin, DollarSign, FileText, Home } from "lucide-react";

type FormState = {
  title: string;
  address: string;
  type: string;
  price: string;
  description: string;
};

type ImageMessageType = {
  type: "success" | "error";
  text: string;
};

const emptyForm: FormState = {
  title: "",
  address: "",
  type: "",
  price: "",
  description: "",
};

export default function PropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMessage, setImageMessage] = useState<ImageMessageType | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProperties({ page, limit });
      setItems(res.data);
      setTotalPages(res.meta.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageMessage(null);
    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      address: form.address.trim(),
      type: form.type.trim(),
      price: Number(form.price),
      description: form.description.trim(),
    };

    if (!payload.title || !payload.address || !payload.type || !payload.price || !payload.description) {
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await updateProperty(editingId, payload);
      } else {
        const created = await createProperty(payload);
        if (imageFile) {
          try {
            await uploadImage(imageFile, created.id);
            setImageMessage({
              type: "success",
              text: "Imagen subida correctamente.",
            });
          } catch {
            setImageMessage({
              type: "error",
              text: "La propiedad se creó, pero la imagen no se pudo subir.",
            });
          }
        }
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (p: Property) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      address: p.address,
      type: p.type,
      price: String(p.price),
      description: p.description,
    });
    setImageFile(null);
    setImageMessage(null);
  };

  const onDelete = async (id: number) => {
    const ok = confirm("¿Eliminar esta propiedad?");
    if (!ok) return;
    await deleteProperty(id);
    await load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageMessage(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent rounded-full blur-3xl dark:from-cyan-400/10 dark:to-blue-400/10" />
        <div className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl dark:from-blue-400/10 dark:to-cyan-400/10" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-transparent p-8 shadow-lg shadow-slate-300/20 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-800/30 dark:to-transparent dark:shadow-black/30">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] dark:bg-cyan-400/20" />
          <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-400/20" />
          
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Propiedades
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:border-cyan-400/30 dark:bg-cyan-500/20 dark:text-cyan-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 dark:bg-cyan-300" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    </span>
                    Live
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  CRUD completo + paginación (consume tu API).
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{items.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Card */}
        <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/20 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30 sm:p-8">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/5 blur-[60px] dark:bg-cyan-400/10" />
          
          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingId ? "Editar propiedad" : "Nueva propiedad"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingId ? "Modifica los datos de la propiedad" : "Agrega una nueva propiedad al catálogo"}
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Home className="h-4 w-4 text-cyan-500" />
                    Título
                  </label>
                  <input
                    id="title"
                    placeholder="Ej: Casa en el centro"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    Dirección
                  </label>
                  <input
                    id="address"
                    placeholder="Ej: Calle Principal 123"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <FileText className="h-4 w-4 text-cyan-500" />
                    Tipo
                  </label>
                  <input
                    id="type"
                    placeholder="Ej: Venta, Alquiler"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign className="h-4 w-4 text-cyan-500" />
                    Precio
                  </label>
                  <input
                    id="price"
                    type="number"
                    placeholder="Ej: 250000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Descripción
                </label>
                <textarea
                  id="description"
                  placeholder="Describe la propiedad..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>

              {!editingId && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <ImagePlus className="h-4 w-4 text-cyan-500" />
                    Imagen (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:hover:bg-cyan-600 focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:file:bg-cyan-600 dark:file:hover:bg-cyan-700"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-600 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-800"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : editingId ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Crear propiedad
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-800"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {imageMessage && (
                <div className={`rounded-xl px-4 py-3 text-sm ${
                  imageMessage.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30" 
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30"
                }`}>
                  {imageMessage.text}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Properties Table */}
        <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px] dark:bg-blue-400/10" />
          
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Listado de propiedades
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    Página <span className="font-bold">{page}</span> de <span className="font-bold">{totalPages}</span>
                  </span>

                  <button
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center gap-3 rounded-xl bg-slate-100 px-6 py-3 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Cargando propiedades...
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-slate-600 dark:bg-slate-800/50">
                  <Building2 className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No hay propiedades</h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Comienza creando tu primera propiedad
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Título
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Dirección
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 w-48">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {items.map((property) => (
                      <tr key={property.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {property.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {property.address}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                            {property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          ${property.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEdit(property)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-800/50"
                            >
                              <Pencil className="h-3 w-3" />
                              Editar
                            </button>
                            <button
                              onClick={() => onDelete(property.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50"
                            >
                              <Trash2 className="h-3 w-3" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}