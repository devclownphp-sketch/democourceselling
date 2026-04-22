"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark, IconDashboard, IconBook, IconMail, IconUsers, IconSettings, IconLogout, IconUser, IconShield, IconStar, IconBox, IconQuiz, IconBlog, IconPdf, IconQuestion } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
    { href: "/admin", label: "Dashboard", Icon: IconDashboard },
    { href: "/admin/courses", label: "Courses", Icon: IconBook },
    { href: "/admin/quizzes", label: "Quizzes", Icon: IconQuiz },
    { href: "/admin/blogs", label: "Blogs", Icon: IconBlog },
    { href: "/admin/course-types", label: "Course Types", Icon: IconBox },
    { href: "/admin/drive-folders", label: "Drive Folders", Icon: IconPdf },
    { href: "/admin/faqs", label: "FAQs", Icon: IconQuestion },
    { href: "/admin/reviews", label: "Reviews", Icon: IconStar },
    { href: "/admin/contacts", label: "Contacts", Icon: IconMail },
    { href: "/admin/admins", label: "Admins", Icon: IconUsers },
    { href: "/admin/settings", label: "Settings", Icon: IconSettings },
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
                    <p className="admin-kicker"><IconShield size={12} /> Control Panel</p>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><LogoMark size={22} /> WEBCOM</h2>
                    <p className="muted-text">Manage courses, contacts & team.</p>
                    <div className="admin-user-chip"><IconUser size={13} /> {admin.username}</div>
                    <div style={{ marginTop: "0.75rem" }}>
                        <ThemeToggle />
                    </div>
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
                                <item.Icon size={16} />
                                {item.label}
                                {active && <span className="admin-link-dot" />}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <button type="button" className="btn-danger" style={{ display: "flex", alignItems: "center", gap: "0.4rem", flex: 1 }} onClick={logout}>
                        <IconLogout size={15} /> Logout
                    </button>
                </div>
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
