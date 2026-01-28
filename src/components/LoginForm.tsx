export default function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Ingresa a tu cuenta</h2>
          <p className="mt-2 text-sm text-slate-600">
            ¿No tienes cuenta?
            <a href="/register" className="font-semibold text-cyan-500 hover:text-cyan-400"> Regístrate</a>
          </p>
        </div>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Correo electrónico</label>
            <input
              type="email"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}