"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/admin", label: "Dashboard", emoji: "\ud83d\udcca" },
    { href: "/admin/courses", label: "Courses", emoji: "\ud83d\udcda" },
    { href: "/admin/contacts", label: "Contacts", emoji: "\ud83d\udce9" },
    { href: "/admin/admins", label: "Admins", emoji: "\ud83d\udc65" },
    { href: "/admin/settings", label: "Settings", emoji: "\u2699\ufe0f" },
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

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="sidebar-overlay open"
                        onClick={closeSidebar}
                    />
                )}
            </AnimatePresence>

            <aside className={sidebarOpen ? "admin-sidebar open" : "admin-sidebar"}>
                <div className="admin-sidebar-top">
                    <p className="admin-kicker">{"\ud83d\udd10"} Control Panel</p>
                    <h2>LearnSphere</h2>
                    <p className="muted-text">Manage courses, contacts & team.</p>
                    <div className="admin-user-chip">{"\ud83d\udc64"} {admin.username}</div>
                </div>
                <nav className="admin-nav">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={active ? "admin-link active" : "admin-link"}
                                onClick={closeSidebar}
                            >
                                <span className="admin-link-emoji">{item.emoji}</span>
                                {item.label}
                                {active && <span className="admin-link-dot" />}
                            </Link>
                        );
                    })}
                </nav>
                <button type="button" className="btn-danger" onClick={logout}>
                    {"\ud83d\udeaa"} Logout
                </button>
            </aside>

            <main className="admin-main">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
