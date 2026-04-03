"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDark(true);
            document.documentElement.setAttribute("data-theme", "dark");
        } else if (saved === "light") {
            setDark(false);
            document.documentElement.setAttribute("data-theme", "light");
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setDark(true);
            document.documentElement.setAttribute("data-theme", "dark");
        }
        setMounted(true);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (!mounted) return null;

    return (
        <button type="button" onClick={toggle} className="theme-toggle" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
            <div className="theme-toggle-dot">
                {dark ? "\u263E" : "\u2600"}
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                {dark ? "Dark" : "Light"}
            </span>
        </button>
    );
}
