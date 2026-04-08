"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginForm() {
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
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Login failed.");
            }

            router.push("/admin");
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
                <span className="login-emoji">{"\ud83d\udd10"}</span>
                <h1>Admin Login</h1>
                <p className="muted-text">Sign in to manage WEBCOM</p>
            </div>
            <label>
                {"\ud83d\udc64"} Username
                <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    placeholder="Enter username"
                />
            </label>
            <label>
                {"\ud83d\udd11"} Password
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
                {loading ? "\u23f3 Logging in..." : "\ud83d\ude80 Login"}
            </motion.button>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error-text"
                >
                    {"\u274c"} {error}
                </motion.p>
            )}
        </motion.form>
    );
}
