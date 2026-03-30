"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Password change failed.");

            setCurrentPassword("");
            setNewPassword("");
            setMessage("\u2705 Password changed successfully.");
        } catch (submitError) {
            setError(submitError.message || "Password change failed.");
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
            <h3>{"\ud83d\udd12"} Change Password</h3>
            <label>
                {"\ud83d\udd11"} Current Password
                <input required minLength={6} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
            </label>
            <label>
                {"\ud83d\udd10"} New Password
                <input required minLength={6} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
            </label>
            <motion.button className="btn-primary" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {loading ? "\u23f3 Updating..." : "\ud83d\udee1\ufe0f Update Password"}
            </motion.button>
            <AnimatePresence>
                {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{message}</motion.p>}
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">{"\u26a0\ufe0f"} {error}</motion.p>}
            </AnimatePresence>
        </motion.form>
    );
}
