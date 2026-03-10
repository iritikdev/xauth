import { LayoutDashboard, Package, Users, ReceiptIndianRupee, Settings } from "lucide-react";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ReceiptIndianRupee },
  { name: "Categories", href: "/admin/categories", icon: ReceiptIndianRupee },
];

// Wrap your admin pages with this layout to ensure only Admins enter
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Add your Session/Role check logic here
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-[#0f172a] text-white p-6 hidden md:block">
        <h2 className="text-xl font-black italic text-emerald-500 mb-10">AMAZE ADMIN</h2>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <a key={link.name} href={link.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white">
              <link.icon className="w-4 h-4" /> {link.name}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}