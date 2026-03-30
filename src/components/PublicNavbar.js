"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!pathname) return null;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex w-[min(1200px,94vw)] items-center justify-between py-4">
                <h2 className="text-lg font-semibold tracking-wide text-orange-300">LearnSphere</h2>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
                    <Link href="/" className="hover:text-white">Home</Link>
                    <Link href="/courses" className="hover:text-white">Courses</Link>
                    <Link href="/contact" className="hover:text-white">Contact Us</Link>
                    <Link href="/admin/login" className="rounded-full border border-orange-300/40 px-4 py-1.5 text-orange-200 hover:bg-orange-300/10">
                        Admin Login
                    </Link>
                </nav>

                {/* Hamburger button */}
                <button
                    type="button"
                    className="md:hidden flex flex-col justify-center gap-1.5 p-2"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <span className="block h-0.5 w-5 bg-slate-300" />
                    <span className="block h-0.5 w-5 bg-slate-300" />
                    <span className="block h-0.5 w-5 bg-slate-300" />
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <nav className="md:hidden border-t border-white/10 px-4 pb-4 pt-2 text-sm text-slate-300">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="hover:text-white" onClick={() => setMobileOpen(false)}>Home</Link>
                        <Link href="/courses" className="hover:text-white" onClick={() => setMobileOpen(false)}>Courses</Link>
                        <Link href="/contact" className="hover:text-white" onClick={() => setMobileOpen(false)}>Contact Us</Link>
                        <Link href="/admin/login" className="w-fit rounded-full border border-orange-300/40 px-4 py-1.5 text-orange-200 hover:bg-orange-300/10" onClick={() => setMobileOpen(false)}>
                            Admin Login
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
