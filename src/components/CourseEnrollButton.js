"use client";

export default function CourseEnrollButton({ course }) {
    const handleClick = async () => {
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
            className="inline-flex min-h-[44px] rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 hover:scale-105 active:scale-100"
            style={{ background: "linear-gradient(to right, var(--brand), var(--accent))" }}
            onClick={handleClick}
        >
            Enroll on WhatsApp
        </button>
    );
}
