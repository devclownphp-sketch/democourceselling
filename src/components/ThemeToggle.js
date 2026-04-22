"use client";

import { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@/components/Icons";
import { useSettings } from "./SettingsProvider";

export default function ThemeToggle() {
    const { theme, setTheme, loading } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const isLight = theme === "light";

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            title={`${isLight ? "🌙 Dark" : "☀️ Light"} mode`}
            style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "3px solid #000",
                background: "#ffd400",
                color: "#000",
                cursor: "pointer",
                fontSize: 20,
                fontWeight: "bold",
                boxShadow: "3px 3px 0 #000",
                margin: "0 0.5rem",
            }}
        >
            {isLight ? "🌙" : "☀️"}
        </button>
    );
}
