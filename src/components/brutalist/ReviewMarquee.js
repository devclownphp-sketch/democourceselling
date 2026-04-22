"use client";

import { useState, useEffect, useRef } from "react";
import ReviewModal from "./ReviewModal";

const defaultReviews = [
    {
        id: "1",
        name: "Amit Sharma",
        role: "Software Developer, TCS",
        rating: 5,
        quote: "Excellent platform for beginners! The courses are well-structured and the PDF notes are super helpful for revision.",
        isFeatured: true,
        isActive: true,
    },
    {
        id: "2",
        name: "Priya Patel",
        role: "Student, BCA",
        rating: 5,
        quote: "Mujhe basic computer skills bahut achaane mein help mili. Ab main confident hoon MS Excel aur Python mein!",
        isFeatured: true,
        isActive: true,
    },
    {
        id: "3",
        name: "Rahul Kumar",
        role: "Freelancer",
        rating: 4,
        quote: "Free courses mein yeh quality padhai milti hai, yeh surprising hai. Highly recommended for freshers!",
        isFeatured: true,
        isActive: true,
    },
    {
        id: "4",
        name: "Sneha Singh",
        role: "Data Analyst, Infosys",
        rating: 5,
        quote: "The practical approach of WEBCOM helped me crack my interview. The Python and SQL courses are excellent!",
        isFeatured: true,
        isActive: true,
    },
    {
        id: "5",
        name: "Vikash Yadav",
        role: "Student",
        rating: 5,
        quote: "Best platform for learning web development. The HTML/CSS course is perfect for beginners like me!",
        isFeatured: true,
        isActive: true,
    },
];

export default function ReviewMarquee({ reviews = [], siteSettings = {} }) {
    const [settings, setSettings] = useState({ speed: 30, direction: "ltr", isEnabled: true });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const intervalRef = useRef(null);

    const allReviews = reviews.length > 0 ? reviews : defaultReviews;
    const featuredReviews = allReviews.filter((r) => r.isFeatured && r.isActive);
    const displayReviews = featuredReviews.length > 0 ? featuredReviews : allReviews.filter((r) => r.isActive).slice(0, 4);

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/public/marquee-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings || { speed: 30, direction: "ltr", isEnabled: true });
                }
            } catch (e) {
                console.error("Failed to load marquee settings:", e);
            }
        }
        loadSettings();
    }, []);

    useEffect(() => {
        if (!settings.isEnabled || displayReviews.length === 0) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const intervalTime = (settings.speed || 30) * 100;

        intervalRef.current = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex((prev) => {
                    if (settings.direction === "rtl") {
                        return (prev - 1 + displayReviews.length) % displayReviews.length;
                    } else {
                        return (prev + 1) % displayReviews.length;
                    }
                });
            }
        }, intervalTime);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [settings.speed, settings.direction, settings.isEnabled, isPaused, displayReviews.length]);

    if (!settings.isEnabled || displayReviews.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % displayReviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#ffd400" : "#555" }}>★</span>
        ));
    };

    const currentReview = displayReviews[currentIndex];

    return (
        <>
            <section className="review-section">
                <div className="review-container">
                    <div className="review-header">
                        <h2>Our Students, Their Success</h2>
                        <p>Over 40,000+ students already learning. Ready to be next?</p>
                    </div>

                    <div className="review-single-wrapper">
                        <button className="review-nav-btn prev" onClick={prevSlide}>
                            ◀
                        </button>

                        <div className="review-single-card" key={currentReview.id}>
                            <div className="review-card-header">
                                <div className="review-avatar">
                                    {currentReview.name?.charAt(0)?.toUpperCase() || "S"}
                                </div>
                                <div className="review-info">
                                    <h4 className="review-name">{currentReview.name}</h4>
                                    <p className="review-role">{currentReview.role}</p>
                                </div>
                                <div className="review-linkedin">
                                    <span>in</span>
                                </div>
                            </div>
                            <div className="review-divider" />
                            <div className="review-stars">
                                {renderStars(currentReview.rating)}
                            </div>
                            <p className="review-quote">"{currentReview.quote}"</p>
                        </div>

                        <button className="review-nav-btn next" onClick={nextSlide}>
                            ▶
                        </button>
                    </div>

                    <div className="review-footer">
                        <div className="review-dots">
                            {displayReviews.map((_, index) => (
                                <button
                                    key={index}
                                    className={`review-dot ${index === currentIndex ? "active" : ""}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                        <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
                            ✎ Write a Review
                        </button>
                    </div>
                </div>
            </section>

            <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
        </>
    );
}
