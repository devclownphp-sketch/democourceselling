"use client";

import { useState, useEffect } from "react";

const defaultFaqs = [
    { id: "1", question: "STP Computer Education kya hai?", answer: "STP Computer Education ek online platform hai jo students ko 100% Free Computer Courses provide karta hai. Iska maqsad har student ko free mein quality computer education dena hai, chahe woh kisi bhi background se ho." },
    { id: "2", question: "Kya yahan sabhi courses sach mein free hain?", answer: "Haan, bilkul! Hamare saare courses, PDF notes, aur quizzes 100% free hain. Koi hidden charges nahi, koi premium upsells nahi. Humein believe hai ki education har ek ke liye accessible honi chahiye." },
    { id: "3", question: "Course ki language (bhasha) kya hai?", answer: "Hamare courses Hindi-English mix mein hain jo easy samjhne ke liye banaye gaye hain. Beginners ke liye perfect hai!" },
    { id: "4", question: "Kaise shuru karein?", answer: "Bas kisi bhi course par click karein aur turant shuru karein. Koi login nahi, koi registration nahi - bas padho aur sikho!" },
];

export default function FAQSection() {
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFaqs() {
            try {
                const res = await fetch("/api/public/faqs");
                if (res.ok) {
                    const data = await res.json();
                    if (data.faqs && data.faqs.length > 0) {
                        setFaqs(data.faqs);
                    } else {
                        setFaqs(defaultFaqs);
                    }
                }
            } catch (e) {
                console.error("Failed to load FAQs:", e);
            } finally {
                setLoading(false);
            }
        }
        loadFaqs();
    }, []);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <section className="faq-section">
                <div className="faq-container">
                    <div className="faq-header">
                        <h2>Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="faq-skeleton" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

    return (
        <section className="faq-section">
            <div className="faq-container">
                {/* Header */}
                <div className="faq-header">
                    <h2>Frequently Asked Questions</h2>
                    <p>Got questions? We have answers.</p>
                </div>

                {/* FAQ Items */}
                <div className="faq-list">
                    {displayFaqs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className={`brutal-faq-item ${openIndex === index ? "open" : ""}`}
                        >
                            <button
                                className="brutal-faq-question"
                                onClick={() => toggle(index)}
                            >
                                <span>{faq.question}</span>
                                <span className="brutal-faq-icon">{openIndex === index ? "▲" : "▼"}</span>
                            </button>
                            {openIndex === index && (
                                <div className="brutal-faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
