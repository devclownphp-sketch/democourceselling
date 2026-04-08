"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Icons";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!pathname) return null;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return null;

    return (
        <header
            className="sticky top-0 z-50 transition-all duration-200"
            style={{
                borderBottom: `1px solid var(--border-light)`,
                background: "var(--nav-bg)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1200px", height: "72px" }}>
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 font-bold text-lg tracking-tight transition-opacity hover:opacity-75"
                    style={{ color: "var(--brand-primary)", WebkitTapHighlightColor: "transparent" }}
                >
                    <div className="rounded-lg p-1.5" style={{ background: "var(--brand-primary-light)" }}>
                        <LogoMark size={24} />
                    </div>
                    <span className="hidden sm:inline" style={{ letterSpacing: "-0.01em" }}>WEBCOM</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { href: "/", label: "Home" },
                        { href: "/courses", label: "Courses" },
                        { href: "/quiz", label: "Quiz" },
                        { href: "/contact", label: "Contact" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium transition-all duration-200 relative"
                            style={{
                                color: pathname === item.href ? "var(--brand-primary)" : "var(--text-secondary)",
                            }}
                        >
                            {item.label}
                            {pathname === item.href && (
                                <span
                                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full"
                                    style={{ background: "var(--brand-primary)" }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Admin Button */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/admin/login"
                        className="px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md active:scale-95"
                        style={{
                            border: "1px solid var(--border-default)",
                            background: "var(--brand-primary-light)",
                            color: "var(--brand-primary)",
                        }}
                    >
                        Admin
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors"
                    style={{
                        border: "1px solid var(--border-light)",
                        background: "transparent",
                        color: "var(--text-primary)",
                    }}
                    onClick={() => setMobileOpen((p) => !p)}
                    aria-label="Toggle menu"
                >
                    <span className="block h-0.5 w-5 rounded-full transition-all" style={{ background: "var(--brand-primary)" }} />
                    <span className="block h-0.5 w-5 rounded-full transition-all" style={{ background: "var(--brand-primary)" }} />
                    <span className="block h-0.5 w-5 rounded-full transition-all" style={{ background: "var(--brand-primary)" }} />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <nav
                    className="md:hidden border-t animate-in fade-in slide-in-up duration-200"
                    style={{
                        borderColor: "var(--border-light)",
                        background: "var(--paper)",
                    }}
                >
                    <div className="px-4 py-4 space-y-3">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/courses", label: "Courses" },
                            { href: "/quiz", label: "Quiz" },
                            { href: "/contact", label: "Contact" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                                style={{
                                    color: pathname === item.href ? "var(--brand-primary)" : "var(--text-secondary)",
                                    background: pathname === item.href ? "var(--brand-primary-light)" : "transparent",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/admin/login"
                            onClick={() => setMobileOpen(false)}
                            className="block w-full px-3 py-2 rounded-lg font-medium text-sm text-center transition-all"
                            style={{
                                border: "1px solid var(--border-default)",
                                background: "var(--brand-primary-light)",
                                color: "var(--brand-primary)",
                            }}
                        >
                            Admin Login
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
