import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";
import HamburgerMenu from "../components/HamburgerMenu";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const roleLower = role?.toLowerCase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      {/* Mobile header with hamburger menu */}
      <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo1.png" 
              alt="Logo" 
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-bold text-foreground">InmoCore</span>
          </div>
          <HamburgerMenu onClick={toggleMobileMenu} isOpen={mobileMenuOpen} />
        </div>
      </header>
      
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
            onClick={closeMobileMenu} 
          />
        )}
        
        {/* Sidebar navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `} style={{ backgroundColor: 'hsl(var(--sidebar))', color: 'hsl(var(--sidebar-foreground))' }}>
          <div className="p-6">
            {/* Logo in sidebar */}
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="/images/logo1.png" 
                alt="Logo" 
                className="h-9 w-9 rounded-xl object-cover"
              />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Panel</p>
                <p className="font-bold text-foreground">InmoCore</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 text-sm">
              {roleLower === "admin" && (
                <Link to="/dashboard/admin" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Inicio admin
                </Link>
              )}
              {roleLower === "agent" && (
                <Link to="/dashboard/agent" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Inicio agente
                </Link>
              )}
              {roleLower === "user" && (
                <Link to="/dashboard/user" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Inicio usuario
                </Link>
              )}

              {(roleLower === "admin" || roleLower === "agent") && (
                <>
                  <Link to="/dashboard/properties" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Propiedades
                  </Link>
                  <Link to="/dashboard/catalogs" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Catalogos
                  </Link>
                  <Link to="/dashboard/contracts" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Contratos
                  </Link>
                  <Link to="/dashboard/images" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Imagenes
                  </Link>
                  <Link to="/dashboard/mail" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Mail
                  </Link>
                </>
              )}

              {(roleLower === "agent" || roleLower === "user") && (
                <Link to="/dashboard/appointments" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Citas
                </Link>
              )}

              {(roleLower === "admin" || roleLower === "agent" || roleLower === "user") && (
                <Link to="/dashboard/requests" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                  Solicitudes
                </Link>
              )}

              {roleLower === "admin" && (
                <>
                  <Link to="/dashboard/transactions" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Transacciones
                  </Link>
                  <Link to="/dashboard/agents" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Agentes
                  </Link>
                  <Link to="/dashboard/users" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                    Usuarios
                  </Link>
                </>
              )}
            </nav>

            <button
              onClick={onLogout}
              className="mt-8 w-full rounded-lg bg-destructive/10 py-2 text-sm text-destructive hover:bg-destructive hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Top Info Bar - hidden on mobile */}
          <div className="hidden sm:flex mb-6 items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-sm font-medium italic text-muted-foreground">Sesión: {roleLower}</p>
            <Link to="/" className="text-xs font-semibold hover:underline">Ver sitio público</Link>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}