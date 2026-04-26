"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconFree, IconPdf, IconRocket, IconLock, IconPhone, IconTool, IconStar, IconShield } from "@/components/Icons";

const iconMap = {
    check: <IconCheck size={24} />,
    free: <IconFree size={24} />,
    pdf: <IconPdf size={24} />,
    rocket: <IconRocket size={24} />,
    lock: <IconLock size={24} />,
    phone: <IconPhone size={24} />,
    tool: <IconTool size={24} />,
    star: <IconStar size={24} />,
    shield: <IconShield size={24} />,
};

const defaultFeatures = [
    { id: "1", icon: "free", title: "100% Free", description: "Access courses and resources with no hidden costs.", color: "#3b82f6" },
    { id: "2", icon: "pdf", title: "PDF Notes", description: "Download concise notes for quick revision and exam prep.", color: "#10b981" },
    { id: "3", icon: "lock", title: "No Login", description: "Start learning instantly—no account required.", color: "#f59e0b" },
    { id: "4", icon: "shield", title: "Secure", description: "Privacy-first experience with reliable uptime.", color: "#8b5cf6" },
    { id: "5", icon: "phone", title: "Call Support", description: "Mon–Sat, 10:00 AM–12:00 PM for phone assistance.", color: "#14b8a6" },
    { id: "6", icon: "tool", title: "Project-based Practice", description: "Build real projects to strengthen skills and portfolio.", color: "#ec4899" },
];

export default function WhyChooseUs() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeatures() {
            try {
                const res = await fetch("/api/public/features");
                if (res.ok) {
                    const data = await res.json();
                    if (data.features && data.features.length > 0) {
                        setFeatures(data.features);
                    } else {
                        setFeatures(defaultFeatures);
                    }
                }
            } catch (e) {
                console.error("Failed to load features:", e);
            } finally {
                setLoading(false);
            }
        }
        loadFeatures();
    }, []);

    if (loading) {
        return (
            <section className="why-section">
                <div className="why-container">
                    <div className="why-header">
                        <h2>Why Choose Us</h2>
                        <p>Simple, secure, and truly student-friendly</p>
                    </div>
                    <div className="brutal-grid-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="why-skeleton" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const displayFeatures = features.length > 0 ? features : defaultFeatures;

    return (
        <section className="why-section">
            <div className="why-container">
                <div className="why-header">
                    <h2>Why Choose Us</h2>
                    <p>Simple, secure, and truly student-friendly</p>
                </div>

                <div className="brutal-grid-3">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="brutal-why-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className="brutal-why-icon"
                                style={{
                                    background: `${feature.color || "#6366f1"}20`,
                                    color: feature.color || "#6366f1",
                                }}
                            >
                                {iconMap[feature.icon] || <IconCheck size={24} color={feature.color || "#6366f1"} />}
                            </div>
                            <h3 className="brutal-why-title">{feature.title}</h3>
                            <p className="brutal-why-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
