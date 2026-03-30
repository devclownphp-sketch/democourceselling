"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        router.push("/admin/login");
        router.refresh();
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-layout">
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? "\u2715" : "\u2630"}
            </button>
            <div
                className={sidebarOpen ? "sidebar-overlay open" : "sidebar-overlay"}
                onClick={closeSidebar}
            />
            <aside className={sidebarOpen ? "admin-sidebar open" : "admin-sidebar"}>
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
                            onClick={closeSidebar}
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
