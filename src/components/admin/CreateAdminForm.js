"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdminForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not create admin.");
            }

            setUsername("");
            setPassword("");
            setMessage("Admin created successfully.");
            router.refresh();
        } catch (submitError) {
            setError(submitError.message || "Could not create admin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="panel form-grid" onSubmit={onSubmit}>
            <h3>Create New Admin</h3>
            <label>
                Username
                <input required value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label>
                Password
                <input
                    required
                    minLength={6}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
            </button>
            {message ? <p className="success-text">{message}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
        </form>
    );
}
