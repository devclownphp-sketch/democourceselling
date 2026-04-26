"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext({
    settings: null,
    loading: true,
});

export function useSettings() {
    return useContext(SettingsContext);
}

export default function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/settings/public");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings || {});
                }
            } catch (e) {
                console.error("Failed to load settings:", e);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    if (loading) {
        return <>{children}</>;
    }

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}