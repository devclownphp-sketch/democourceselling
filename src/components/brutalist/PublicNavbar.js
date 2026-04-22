"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/study-materials", label: "Study Materials" },
    { href: "/certificates", label: "Certificates" },
    { href: "/quiz", label: "Quiz" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className="public-navbar"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "#fff",
                borderBottom: "4px solid #000",
                boxShadow: scrolled ? "0 4px 0 #000" : "none",
                transition: "all 0.2s ease",
            }}
        >
            <div className="public-navbar-inner">
                <Link href="/" className="public-navbar-logo">
                    WEBCOM
                </Link>

                <div className="public-navbar-links hide-mobile">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="public-navbar-link"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                    <Link href="/admin" className="public-navbar-admin">
                        Admin
                    </Link>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="show-mobile public-navbar-menu-btn"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {menuOpen && (
                <div className="public-navbar-mobile-menu">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="public-navbar-mobile-link"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="public-navbar-mobile-footer">
                        <ThemeToggle />
                        <Link href="/admin" onClick={() => setMenuOpen(false)} className="public-navbar-admin">
                            Admin
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
