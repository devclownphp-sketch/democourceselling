"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!pathname) return null;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return null;

    return (
        <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/85 backdrop-blur-lg">
            <div className="mx-auto flex w-[min(1100px,92vw)] items-center justify-between py-3">
                <h2 className="text-lg font-bold tracking-wide text-indigo-600">🌐 LearnSphere</h2>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-indigo-800/70">
                    <Link href="/" className="transition hover:text-indigo-600">Home</Link>
                    <Link href="/courses" className="transition hover:text-indigo-600">Courses</Link>
                    <Link href="/contact" className="transition hover:text-indigo-600">Contact Us</Link>
                    <Link href="/admin/login" className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-indigo-600 font-semibold transition hover:bg-indigo-100">
                        Admin Login
                    </Link>
                </nav>
                <button type="button" className="md:hidden flex flex-col justify-center gap-1.5 p-2" onClick={() => setMobileOpen((p) => !p)} aria-label="Toggle menu">
                    <span className="block h-0.5 w-5 rounded bg-indigo-500" />
                    <span className="block h-0.5 w-5 rounded bg-indigo-500" />
                    <span className="block h-0.5 w-5 rounded bg-indigo-500" />
                </button>
            </div>
            {mobileOpen && (
                <nav className="md:hidden border-t border-indigo-100 px-4 pb-4 pt-2 text-sm font-medium text-indigo-800/70">
                    <div className="flex flex-col gap-3">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-indigo-600">Home</Link>
                        <Link href="/courses" onClick={() => setMobileOpen(false)} className="hover:text-indigo-600">Courses</Link>
                        <Link href="/contact" onClick={() => setMobileOpen(false)} className="hover:text-indigo-600">Contact Us</Link>
                        <Link href="/admin/login" onClick={() => setMobileOpen(false)} className="w-fit rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-indigo-600 hover:bg-indigo-100">Admin Login</Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
