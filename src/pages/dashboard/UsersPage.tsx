import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../../api/users.api";
import type { User } from "../../types/user.types";

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [editing, setEditing] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit });
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

  const startEdit = (u: User) => {
    setEditing(u);
    setUsername(u.username ?? "");
    setPassword("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setUsername("");
    setPassword("");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    await updateUser(editing.id, {
      username: username.trim(),
      ...(password.trim() ? { password: password.trim() } : {}),
    });

    cancelEdit();
    await load();
  };

  const onDelete = async (id: number) => {
    const ok = confirm("¿Eliminar este usuario?");
    if (!ok) return;
    await deleteUser(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios (Admin)</h1>
        <p className="text-gray-600 text-sm">
          Gestión de usuarios con paginación y edición básica.
        </p>
      </div>

      {/* EDIT FORM */}
      {editing && (
        <form onSubmit={saveEdit} className="bg-white rounded shadow p-4 grid gap-3">
          <div className="font-semibold">Editar usuario #{editing.id}</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border rounded p-2"
              placeholder="Usuario (email)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="border rounded p-2"
              placeholder="Nueva contrasena (opcional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
                Guardar
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <span className="font-semibold">Listado</span>

          <div className="flex items-center gap-2 text-sm">
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>

            <span>
              Página <b>{page}</b> de <b>{totalPages}</b>
            </span>

            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-4 text-gray-600">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-gray-600">Sin usuarios.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Email/Username</th>
                <th className="text-left p-3 w-44">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.username ?? "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300"
                        onClick={() => startEdit(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-200 hover:bg-red-300"
                        onClick={() => onDelete(u.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
