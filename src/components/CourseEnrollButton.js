"use client";

import { useState } from "react";

export default function CourseEnrollButton({ course }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/enroll-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: course.id,
                    path: window.location.pathname,
                }),
            });
        } catch {
            // Ignore tracking errors and continue to WhatsApp.
        } finally {
            setIsLoading(false);
        }

        const number = String(course.whatsappNumber || "").replace(/\D/g, "");
        const message = [
            `Hello, I want to enroll in this course: ${course.title}`,
            `Duration: ${course.duration}`,
            `Level: ${course.level}`,
            `Offer Price: INR ${course.offerPrice}`,
        ].join("\n");

        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            type="button"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
                background: "var(--brand-primary)",
            }}
            onClick={handleClick}
        >
            {isLoading ? "Loading..." : "Enroll on WhatsApp"}
        </button>
    );
}
