"use client";

import { useState } from "react";

const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

const socialItems = [
    { key: "twitterUrl", label: "𝕏", ariaLabel: "Twitter" },
    { key: "facebookUrl", label: "f", ariaLabel: "Facebook" },
    { key: "instagramUrl", label: "◉", ariaLabel: "Instagram" },
    { key: "linkedinUrl", label: "in", ariaLabel: "LinkedIn" },
    { key: "youtubeUrl", label: "▶", ariaLabel: "YouTube" },
];

export default function ContactForm({ businessProfile }) {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({ type: "", message: "" });
    const [focusedField, setFocusedField] = useState(null);

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
            setResult({ type: "success", message: "Thank you! Your message has been delivered." });
        } catch (error) {
            setResult({ type: "error", message: error.message || "Could not submit your message. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = (isFocused) => ({
        border: isFocused ? "1px solid var(--brand-primary)" : "1px solid var(--border-default)",
        background: "var(--paper)",
        color: "var(--text-primary)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-md) var(--spacing-lg)",
        fontSize: "var(--font-size-base)",
        fontFamily: "inherit",
        outline: "none",
        transition: "all var(--transition-fast) ease",
        boxShadow: isFocused ? "0 0 0 3px rgba(37, 99, 235, 0.05)" : "none",
        width: "100%",
        minHeight: "48px",
    });

    return (
        <div className="space-y-12">
            {/* Main Contact Section */}
            <section
                className="rounded-2xl overflow-hidden"
                style={{
                    border: "1px solid var(--border-light)",
                    background: "var(--paper)",
                    boxShadow: "var(--shadow-lg)",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Left Column - Form and Map */}
                    <div className="p-8 md:p-10 lg:p-12">
                        {/* Header */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--brand-primary)" }}>
                                Get In Touch
                            </p>
                            <h2 className="mt-3 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                                Let&apos;s Connect
                            </h2>
                            <p className="mt-2 text-base" style={{ color: "var(--text-secondary)", lineHeight: "1.625" }}>
                                {businessProfile.contactSubtext || "Have a question or want to learn more? We&apos;d love to hear from you."}
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <article
                                className="rounded-xl p-4"
                                style={{
                                    border: "1px solid var(--border-light)",
                                    background: "var(--bg)",
                                }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                    Phone
                                </p>
                                <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    {businessProfile.supportPhone}
                                </p>
                            </article>
                            <article
                                className="rounded-xl p-4"
                                style={{
                                    border: "1px solid var(--border-light)",
                                    background: "var(--bg)",
                                }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                    Email
                                </p>
                                <p className="mt-2 text-sm font-medium break-all" style={{ color: "var(--text-primary)" }}>
                                    {businessProfile.supportEmail}
                                </p>
                            </article>
                        </div>

                        {/* Map */}
                        {businessProfile.mapEmbedUrl ? (
                            <div
                                className="mb-8 overflow-hidden rounded-xl h-64"
                                style={{
                                    border: "1px solid var(--border-light)",
                                }}
                            >
                                <iframe
                                    title="Business Location"
                                    src={businessProfile.mapEmbedUrl}
                                    className="w-full h-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ border: "none" }}
                                />
                            </div>
                        ) : null}

                        {/* Form */}
                        <form className="space-y-5" onSubmit={onSubmit}>
                            <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                                Send us a message
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <label className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                        Your Name
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        onFocus={() => setFocusedField("name")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="John Doe"
                                        style={inputStyles(focusedField === "name")}
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                        Phone Number
                                    </span>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={onChange}
                                        onFocus={() => setFocusedField("phone")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="+91 98765 43210"
                                        style={inputStyles(focusedField === "phone")}
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                    Email Address
                                </span>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="john@example.com"
                                    style={inputStyles(focusedField === "email")}
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                    Message
                                </span>
                                <textarea
                                    required
                                    name="message"
                                    value={form.message}
                                    onChange={onChange}
                                    onFocus={() => setFocusedField("message")}
                                    onBlur={() => setFocusedField(null)}
                                    rows={4}
                                    placeholder="Tell us what's on your mind..."
                                    style={{
                                        ...inputStyles(focusedField === "message"),
                                        minHeight: "120px",
                                        resize: "vertical",
                                    }}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 rounded-lg font-semibold text-base text-white transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: "var(--brand-primary)",
                                }}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                            {/* Result Message */}
                            {result.message && (
                                <div
                                    className="p-4 rounded-lg text-sm font-medium"
                                    style={{
                                        background: result.type === "error" ? "var(--danger-light)" : "var(--success-light)",
                                        color: result.type === "error" ? "var(--danger)" : "var(--success)",
                                        border: `1px solid ${result.type === "error" ? "var(--danger)" : "var(--success)"}`,
                                    }}
                                >
                                    {result.message}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div
                        className="p-8 md:p-10 lg:p-12 hidden lg:flex flex-col justify-between"
                        style={{
                            background: "var(--bg)",
                            borderLeft: "1px solid var(--border-light)",
                        }}
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                                Why Choose Us
                            </p>
                            <h3 className="mt-4 text-2xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                                {businessProfile.contactHeadline || "Your Gateway to Learning"}
                            </h3>
                            <p className="mt-4 text-base" style={{ color: "var(--text-secondary)", lineHeight: "1.625" }}>
                                {businessProfile.contactSubtext || "Connect with us for courses, quizzes, and resources designed to help you succeed."}
                            </p>

                            {/* Quick Info */}
                            <div className="mt-8 space-y-4">
                                <article className="rounded-lg p-4" style={{ background: "var(--paper)" }}>
                                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                                        Address
                                    </p>
                                    <p className="mt-2 text-sm" style={{ color: "var(--text-primary)" }}>
                                        {businessProfile.addressLine}
                                    </p>
                                </article>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-tertiary)" }}>
                                Follow Us
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                                {socialItems
                                    .filter((item) => Boolean(businessProfile[item.key]))
                                    .map((item) => (
                                        <a
                                            key={item.key}
                                            href={businessProfile[item.key]}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-md hover:scale-110 active:scale-95"
                                            style={{
                                                border: "1px solid var(--border-light)",
                                                background: "var(--paper)",
                                                color: "var(--brand-primary)",
                                            }}
                                            aria-label={item.ariaLabel}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternative Contact Methods */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Call Us", value: businessProfile.supportPhone, icon: "📞" },
                    { title: "Email Us", value: businessProfile.supportEmail, icon: "✉️" },
                    { title: "Visit Us", value: businessProfile.addressLine, icon: "📍" },
                ].map((method, idx) => (
                    <article
                        key={idx}
                        className="rounded-xl p-6 transition-all duration-200 hover:shadow-md"
                        style={{
                            border: "1px solid var(--border-light)",
                            background: "var(--paper)",
                        }}
                    >
                        <span className="text-3xl">{method.icon}</span>
                        <h4 className="mt-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                            {method.title}
                        </h4>
                        <p className="mt-1 text-sm break-all" style={{ color: "var(--text-secondary)" }}>
                            {method.value}
                        </p>
                    </article>
                ))}
            </section>
        </div>
    );
}
