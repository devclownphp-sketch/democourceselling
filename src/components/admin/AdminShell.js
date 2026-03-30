"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/courses", label: "Courses" },
    { href: "/admin/contacts", label: "Contacts" },
    { href: "/admin/admins", label: "Admins" },
    { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ admin, children }) {
    const pathname = usePathname();
    const router = useRouter();

    const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-top">
                    <p className="admin-kicker">Control Panel</p>
                    <h2>LearnSphere Admin</h2>
                    <p className="muted-text">Manage courses, contacts, and team accounts.</p>
                    <div className="admin-user-chip">{admin.username}</div>
                </div>
                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={pathname === item.href ? "admin-link active" : "admin-link"}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <button type="button" className="btn-danger" onClick={logout}>
                    Logout
                </button>
            </aside>
            <main className="admin-main">{children}</main>
        </div>
    );
}
