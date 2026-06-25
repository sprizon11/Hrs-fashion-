import { Link, useLocation } from "wouter";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, LogOut, Menu, X, Store, ChevronRight } from "lucide-react";
import { adminApi } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await adminApi.logout().catch(() => {});
    navigate("/admin/login");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-slate-900 text-white ${mobile ? "w-full" : "w-64"}`}>
      <div className="px-6 py-6 border-b border-slate-700/60">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">Admin Panel</p>
        <h1 className="text-xl font-serif font-semibold text-white">HRS Fashion</h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const active = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              data-testid={`admin-nav-${item.label.toLowerCase()}`}
            >
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-rose-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-rose-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-slate-700/60 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          data-testid="admin-nav-store"
        >
          <Store className="w-4.5 h-4.5" />
          <span>View Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          data-testid="admin-nav-logout"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex flex-shrink-0 flex-col h-full">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0 h-full">
            <Sidebar mobile />
          </div>
          <button className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 bg-slate-900 text-white border-b border-slate-700 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif text-lg">HRS Fashion Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
