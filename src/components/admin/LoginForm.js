"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UnifiedLoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const adminRes = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (adminRes.ok) {
                router.push("/admin");
                router.refresh();
                return;
            }

            const subadminRes = await fetch("/api/subadmin-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (subadminRes.ok) {
                const subData = await subadminRes.json();
                if (subData.urlId) {
                    document.cookie = `subadmin_session=${subData.token || ""};path=/;max-age=3600`;
                    const loginRes = await fetch("/api/admin/login/subadmin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    });
                    if (loginRes.ok) {
                        const loginData = await loginRes.json();
                        const urlId = loginData.urlId || subData.urlId;
                        router.push(`/${urlId}/dashboard`);
                        router.refresh();
                        return;
                    }
                    router.push(`/${subData.urlId}/dashboard`);
                    router.refresh();
                    return;
                }
            }

            setError("Invalid username or password. Please try again.");
        } catch (submitError) {
            setError(submitError.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="panel form-grid"
            onSubmit={onSubmit}
        >
            <div className="login-header">
                <span className="login-emoji">{"🔐"}</span>
                <h1>Panel Login</h1>
                <p className="muted-text">Sign in as Admin or SubAdmin</p>
            </div>
            <label>
                {"👤"} Username
                <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    placeholder="Enter username"
                />
            </label>
            <label>
                {"🔑"} Password
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="Enter password"
                />
            </label>
            <motion.button
                className="btn-primary"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {loading ? "⏳ Logging in..." : "🚀 Login"}
            </motion.button>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error-text"
                >
                    {"❌"} {error}
                </motion.p>
            )}
            <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", color: "#666" }}>
                Admin and SubAdmin credentials both work here
            </p>
        </motion.form>
    );
}
