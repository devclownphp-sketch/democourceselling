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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex w-[min(1100px,92vw)] items-center justify-between py-3">
                <h2 className="text-lg font-bold tracking-wide text-orange-600">
                    {"\ud83c\udf10"} LearnSphere
                </h2>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/" className="transition hover:text-orange-600">Home</Link>
                    <Link href="/courses" className="transition hover:text-orange-600">Courses</Link>
                    <Link href="/contact" className="transition hover:text-orange-600">Contact Us</Link>
                    <Link href="/admin/login" className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-orange-600 font-semibold transition hover:bg-orange-100">
                        Admin Login
                    </Link>
                </nav>

                <button
                    type="button"
                    className="md:hidden flex flex-col justify-center gap-1.5 p-2"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <span className="block h-0.5 w-5 rounded bg-slate-500" />
                    <span className="block h-0.5 w-5 rounded bg-slate-500" />
                    <span className="block h-0.5 w-5 rounded bg-slate-500" />
                </button>
            </div>

            {mobileOpen && (
                <nav className="md:hidden border-t border-slate-100 px-4 pb-4 pt-2 text-sm font-medium text-slate-600">
                    <div className="flex flex-col gap-3">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="hover:text-orange-600">Home</Link>
                        <Link href="/courses" onClick={() => setMobileOpen(false)} className="hover:text-orange-600">Courses</Link>
                        <Link href="/contact" onClick={() => setMobileOpen(false)} className="hover:text-orange-600">Contact Us</Link>
                        <Link href="/admin/login" onClick={() => setMobileOpen(false)} className="w-fit rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-orange-600 hover:bg-orange-100">
                            Admin Login
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
