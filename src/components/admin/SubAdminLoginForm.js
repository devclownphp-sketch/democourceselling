"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SubAdminLoginForm() {
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
            await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});

            const response = await fetch("/api/admin/login/subadmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Login failed.");
            }

            const urlId = data.urlId;
            if (!urlId) {
                throw new Error("Session error - please try again");
            }
            router.push(`/${urlId}/dashboard`);
            router.refresh();
        } catch (submitError) {
            setError(submitError.message || "Login failed.");
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
                <span className="login-emoji">🔐</span>
                <h1>SubAdmin Login</h1>
                <p className="muted-text">Sign in with your subadmin account</p>
            </div>
            <label>
                👤 Username
                <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    placeholder="Enter username"
                />
            </label>
            <label>
                🔒 Password
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
                    ❌ {error}
                </motion.p>
            )}
            <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <Link href="/admin/login" style={{ color: "#666", textDecoration: "underline", fontSize: "0.9rem" }}>
                    ← Back to Admin Login
                </Link>
            </p>
        </motion.form>
    );
}
