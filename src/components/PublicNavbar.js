"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
  const pathname = usePathname();

  if (!pathname) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1200px,94vw)] items-center justify-between py-4">
        <h2 className="text-lg font-semibold tracking-wide text-orange-300">LearnSphere</h2>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/courses" className="hover:text-white">Courses</Link>
          <Link href="/contact" className="hover:text-white">Contact Us</Link>
          <Link href="/admin/login" className="rounded-full border border-orange-300/40 px-4 py-1.5 text-orange-200 hover:bg-orange-300/10">
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
