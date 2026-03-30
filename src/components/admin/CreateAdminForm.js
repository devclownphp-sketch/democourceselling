"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

            if (!response.ok) throw new Error(data.error || "Could not create admin.");

            setUsername("");
            setPassword("");
            setMessage("\u2705 Admin created successfully.");
            router.refresh();
        } catch (submitError) {
            setError(submitError.message || "Could not create admin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="panel form-grid"
            onSubmit={onSubmit}
        >
            <h3>{"\ud83d\udc64"} Create New Admin</h3>
            <label>
                {"\ud83d\udcdd"} Username
                <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
            </label>
            <label>
                {"\ud83d\udd11"} Password
                <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" />
            </label>
            <motion.button className="btn-primary" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {loading ? "\u23f3 Creating..." : "\u2795 Create Admin"}
            </motion.button>
            <AnimatePresence>
                {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{message}</motion.p>}
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">{"\u26a0\ufe0f"} {error}</motion.p>}
            </AnimatePresence>
        </motion.form>
    );
}
