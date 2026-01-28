import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaShieldAlt, FaMagic, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";

export default function Register() {
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
    } catch {
      setError("Las credenciales no coinciden o el usuario ya existe.");
    }
  };

  const features = [
    { icon: FaBuilding, text: "Gestión inteligente de activos", color: "text-blue-200" },
    { icon: FaShieldAlt, text: "Seguridad de grado bancario", color: "text-cyan-200" },
    { icon: FaMagic, text: "IA Predictiva de mercado", color: "text-purple-200" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-4">
      {/* Contenedor Principal con efecto de elevación */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* LADO IZQUIERDO: Branding y Features */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white overflow-hidden">
          {/* Orbes Decorativos de fondo */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-8">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-widest uppercase text-cyan-300">
                Plataforma Pro
              </span>
              <h2 className="text-4xl font-extrabold mt-4 leading-tight">
                Impulsa tu éxito <br /> 
                <span className="text-cyan-400 text-5xl">Inmobiliario.</span>
              </h2>
            </div>
            
            <ul className="space-y-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 ${f.color}`}>
                    <f.icon className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{f.text}</p>
                    <p className="text-xs text-slate-400">Optimizado para el crecimiento de tu negocio.</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 text-sm text-slate-400">
            Únete a más de 2,000 agentes hoy mismo.
          </div>
        </div>

        {/* LADO DERECHO: Formulario */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-slate-800">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Crear cuenta
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Ingresa tus datos para comenzar tu viaje.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all dark:text-white"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-2xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold text-lg shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Procesando...
                </span>
              ) : (
                "Crear cuenta gratuita"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}