"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Icons";
import ThemeToggle from "@/components/ThemeToggle";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!pathname) return null;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return null;

    return (
        <header className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--line)", background: "var(--nav-bg)", backdropFilter: "blur(16px)" }}>
            <div className="mx-auto flex w-[min(1100px,92vw)] items-center justify-between py-3">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-wide no-underline" style={{ color: "var(--brand)" }}>
                    <LogoMark size={28} /> LearnSphere
                </Link>
                <nav className="hidden md:flex items-center gap-5 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    <Link href="/" className="transition hover:opacity-80">Home</Link>
                    <Link href="/courses" className="transition hover:opacity-80">Courses</Link>
                    <Link href="/contact" className="transition hover:opacity-80">Contact Us</Link>
                    <ThemeToggle />
                    <Link href="/admin/login" className="rounded-full px-4 py-1.5 font-semibold transition hover:opacity-90" style={{ border: "1px solid var(--line)", background: "var(--brand-soft)", color: "var(--brand)" }}>
                        Admin Login
                    </Link>
                </nav>
                <button
                    type="button"
                    className="md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-lg transition"
                    style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
                    onClick={() => setMobileOpen((p) => !p)}
                    aria-label="Toggle menu"
                >
                    <span className="block h-0.5 w-5 rounded" style={{ background: "var(--brand)" }} />
                    <span className="block h-0.5 w-5 rounded" style={{ background: "var(--brand)" }} />
                    <span className="block h-0.5 w-5 rounded" style={{ background: "var(--brand)" }} />
                </button>
            </div>
            {mobileOpen && (
                <nav className="md:hidden px-4 pb-4 pt-2 text-sm font-medium" style={{ borderTop: "1px solid var(--line)", color: "var(--text-muted)" }}>
                    <div className="flex flex-col gap-3">
                        <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
                        <Link href="/courses" onClick={() => setMobileOpen(false)}>Courses</Link>
                        <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact Us</Link>
                        <ThemeToggle />
                        <Link href="/admin/login" onClick={() => setMobileOpen(false)} className="w-fit rounded-full px-4 py-1.5" style={{ border: "1px solid var(--line)", background: "var(--brand-soft)", color: "var(--brand)" }}>Admin Login</Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
