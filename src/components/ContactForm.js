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

    return (
        <form
            className="grid gap-4 rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/85 to-slate-800/80 p-6 shadow-xl"
            onSubmit={onSubmit}
        >
            <label className="grid gap-2 text-sm font-medium text-slate-200">
                Name
                <input
                    required
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-400/20"
                />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-200">
                Email
                <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-400/20"
                />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-200">
                Phone
                <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-400/20"
                />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-200">
                Message
                <textarea
                    required
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 outline-none transition focus:border-orange-300/60 focus:ring-2 focus:ring-orange-400/20"
                />
            </label>
            <button
                disabled={loading}
                className="inline-flex w-full sm:w-fit rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
            >
                {loading ? "Submitting..." : "Send Message"}
            </button>
            {result.message ? (
                <p className={result.type === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>{result.message}</p>
            ) : null}
        </form>
    );
}
