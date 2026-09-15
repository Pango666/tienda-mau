import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/admin/context/AuthContext'

import LOGO_URL from '../assets/logo.png'
const SIDEBAR_LINKS = [
  { path: '/admin', label: 'VISTA GENERAL', icon: 'dashboard' },
  { path: '/admin/pedidos', label: 'PEDIDOS', icon: 'receipt_long' },
  { path: '/admin/puntos-entrega', label: 'PUNTOS DE ENTREGA', icon: 'local_shipping' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col">
        {/* Logo */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-outline-variant/30">
          <img alt="Wanted Lodge Logo" className="h-16 w-auto object-contain" src={LOGO_URL} />
          <div className="flex flex-col">
            <span className="font-label-mono text-[9px] text-primary tracking-widest uppercase">
              CONTROL MATRIX
            </span>
          </div>
        </div>

        {/* Drop Status */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="bg-surface-container px-3 py-2 flex items-center justify-between">
            <span className="font-label-mono text-label-mono text-outline uppercase">DROP STATUS</span>
            <span className="flex items-center gap-1.5 font-label-mono text-[10px] text-primary-fixed-dim">
              <span className="w-2 h-2 bg-primary-container animate-ping rounded-full"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col">
          {SIDEBAR_LINKS.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive
                    ? 'flex items-center px-6 py-3 transition-colors uppercase bg-surface-container-high text-primary border-l-2 border-primary font-bold'
                    : 'flex items-center px-6 py-3 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors uppercase'
                }
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                <span className="material-symbols-outlined mr-3 text-[18px]">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/"
            className="mt-auto flex items-center px-6 py-3 font-label-caps text-label-caps text-primary hover:text-on-surface hover:bg-surface-container transition-colors uppercase"
          >
            <span className="material-symbols-outlined mr-3 text-[18px]">storefront</span>
            VER TIENDA ONLINE
          </Link>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-[18px]">person</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-label-mono text-label-mono uppercase truncate text-on-surface">ADMIN</span>
              <span className="font-label-mono text-[9px] text-outline truncate">{user?.email || 'SESSION ACTIVE'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-on-error-container font-label-mono text-[11px] uppercase tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="pl-64">
        {/* Top header */}
        <header className="fixed top-0 left-64 right-0 h-20 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <span className="font-label-mono text-label-mono text-outline uppercase">[ CORE CONSOLE ]</span>
            <span className="text-outline-variant">/</span>
            <span className="font-label-mono text-label-mono text-on-surface uppercase">
              SISTEMA DE GESTIÓN CENTRALIZADO
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-container px-3 py-1.5 border border-outline-variant/40">
              <span className="material-symbols-outlined text-outline text-sm mr-2">terminal</span>
              <input
                className="bg-transparent border-0 outline-none font-label-mono text-body-sm text-on-surface placeholder:text-on-surface-variant/70 w-64"
                placeholder="COMANDOS DE INVENTARIO..."
                type="text"
              />
            </div>
            <button
              aria-label="Notifications"
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="w-full pt-20 px-8 py-8 bg-surface">
          <div className="flex flex-col w-full gap-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
