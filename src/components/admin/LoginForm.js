"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <form className="panel form-grid" onSubmit={onSubmit}>
            <h1>Admin Login</h1>
            <label>
                Username
                <input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </label>
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            {error ? <p className="error-text">{error}</p> : null}
        </form>
    );
}
