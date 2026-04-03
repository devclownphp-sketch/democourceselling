"use client";

import { useState } from "react";

const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

export default function ContactForm() {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({ type: "", message: "" });

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setResult({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed.");
            }

            setForm(initialState);
            setResult({ type: "success", message: "Thanks! Your message has been submitted." });
        } catch (error) {
            setResult({ type: "error", message: error.message || "Could not submit your details." });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        border: "1px solid var(--line)",
        background: "var(--bg-alt)",
        color: "var(--ink)",
        borderRadius: "0.6rem",
        padding: "0.65rem 0.75rem",
        fontSize: "0.92rem",
        outline: "none",
        transition: "border-color 0.15s",
        width: "100%",
        minHeight: "44px",
    };

    return (
        <form
            className="grid gap-4 rounded-2xl p-6 shadow-lg"
            style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
            onSubmit={onSubmit}
        >
            <label className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Name
                <input
                    required
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    style={inputStyle}
                />
            </label>
            <label className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Email
                <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    style={inputStyle}
                />
            </label>
            <label className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Phone
                <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Your phone number"
                    style={inputStyle}
                />
            </label>
            <label className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Message
                <textarea
                    required
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="How can we help?"
                    style={{ ...inputStyle, minHeight: "auto" }}
                />
            </label>
            <button
                disabled={loading}
                className="inline-flex w-full sm:w-fit rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "linear-gradient(to right, var(--brand), var(--accent))", minHeight: "44px" }}
                type="submit"
            >
                {loading ? "Submitting..." : "Send Message"}
            </button>
            {result.message ? (
                <p className={result.type === "error" ? "error-text" : "success-text"}>{result.message}</p>
            ) : null}
        </form>
    );
}
