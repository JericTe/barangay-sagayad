import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Megaphone, FileText, Siren, Users, Settings, LogOut, PhoneCall, ClipboardList } from "lucide-react";
import { getSession, ADMIN_ROLES } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Document Requests", icon: FileText },
  { href: "/admin/services", label: "Services", icon: ClipboardList },
  { href: "/admin/reports", label: "Reports", icon: Siren },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/officials", label: "Officials", icon: Users },
  { href: "/admin/emergency-contacts", label: "Emergency Contacts", icon: PhoneCall },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !ADMIN_ROLES.includes(session.role as (typeof ADMIN_ROLES)[number])) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl gap-6 px-4 py-8 sm:px-6">
      <aside className="hidden w-56 shrink-0 sm:block">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Signed in as
        </p>
        <p className="px-2 text-sm font-bold text-brand-900">{session.name}</p>
        <p className="px-2 pb-4 text-xs text-ink-soft">{session.role.replace(/_/g, " ")}</p>

        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-ink hover:bg-brand-100"
            >
              <item.icon size={16} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="mt-6 px-2">
          <button
            type="submit"
            className="flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
