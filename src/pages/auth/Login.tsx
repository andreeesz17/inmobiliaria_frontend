import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaBuilding,
  FaShieldAlt,
  FaMagic,
  FaCheckCircle,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ username: email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Las credenciales introducidas son incorrectas.");
    }
  };

  const features = [
    { icon: FaBuilding, text: "Gestión de propiedades", color: "text-blue-200" },
    { icon: FaShieldAlt, text: "Seguridad avanzada", color: "text-cyan-200" },
    { icon: FaMagic, text: "IA Predictiva", color: "text-purple-200" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-4">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

        {/* PANEL IZQUIERDO: Branding (Visible en LG) */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white overflow-hidden">
          {/* Luces de fondo (Glow) */}
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-cyan-500/20 rounded-full blur-[90px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-500/20 rounded-full blur-[90px]" />

          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-cyan-500 opacity-20 blur group-hover:opacity-40 transition" />
                <img src="/images/logo1.png" className="relative w-10 h-10 rounded-xl object-cover" alt="Logo" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Inmo<span className="text-cyan-400">Core</span>
              </span>
            </Link>

            <div className="mt-20">
              <h1 className="text-4xl font-extrabold leading-tight mb-6">
                Bienvenido de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  nuevo a la cima.
                </span>
              </h1>

              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
                    <f.icon className={`${f.color} text-lg`} />
                    <span className="text-sm font-medium text-slate-200">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold text-cyan-400/80 tracking-widest uppercase">
            <FaCheckCircle className="animate-pulse" />
            Infraestructura Segura 24/7
          </div>
        </div>

        {/* PANEL DERECHO: Formulario */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-slate-800 transition-colors">

          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/images/logo1.png" className="w-8 h-8 rounded-lg" alt="Logo" />
            <span className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tighter">
              Inmo<span className="text-cyan-500">Core</span>
            </span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Ingresa tus credenciales para acceder.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@inmocore.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Contraseña
                </label>
                <button type="button" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-2xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-lg shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar al Panel</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4">
              ¿Aún no tienes acceso?{" "}
              <Link
                to="/register"
                className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
              >
                Crea una cuenta gratuita
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}