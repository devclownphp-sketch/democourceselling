"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            setDark(true);
            document.documentElement.setAttribute("data-theme", "dark");
        }
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <button type="button" onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
            <div className="theme-toggle-dot">
                {dark ? "\u263E" : "\u2600"}
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                {dark ? "Dark" : "Light"}
            </span>
        </button>
    );
}
