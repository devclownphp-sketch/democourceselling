"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext({
    theme: "light",
    setTheme: () => {},
    pdfViewer: "google",
    settings: null,
    loading: true,
});

export function useSettings() {
    return useContext(SettingsContext);
}

export default function SettingsProvider({ children }) {
    const [theme, setThemeState] = useState("light");
    const [pdfViewer, setPdfViewer] = useState("google");
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const setTheme = async (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);

        try {
            await fetch("/api/admin/site-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ themeMode: newTheme }),
            });
        } catch (e) {
        }
    };

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/settings/public");
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    const dbTheme = s.themeMode || "light";

                    const savedTheme = localStorage.getItem("theme");
                    const themeToApply = savedTheme || dbTheme;

                    setThemeState(themeToApply);
                    document.documentElement.setAttribute("data-theme", themeToApply);

                    setPdfViewer(s.pdfViewer || "google");
                    setSettings(s);
                }
            } catch (e) {
                console.error("Failed to load settings:", e);
                setThemeState("light");
                document.documentElement.setAttribute("data-theme", "light");
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "none" }}>
                {children}
            </div>
        );
    }

    return (
        <SettingsContext.Provider value={{ theme, setTheme, pdfViewer, settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}
