"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconClock, IconStar, IconSearch } from "@/components/Icons";

export default function CoursesClient({ courses = [], courseTypes = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    const filteredCourses = useMemo(() => {
        return courses
            .filter(course => {
                if (selectedCategory && course.courseTypeId !== selectedCategory) return false;
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                        course.title.toLowerCase().includes(query) ||
                        course.shortDescription?.toLowerCase().includes(query)
                    );
                }
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low":
                        return Number(a.offerPrice || 0) - Number(b.offerPrice || 0);
                    case "price-high":
                        return Number(b.offerPrice || 0) - Number(a.offerPrice || 0);
                    case "rating":
                        return Number(b.rating || 0) - Number(a.rating || 0);
                    default:
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                }
            });
    }, [courses, selectedCategory, searchQuery, sortBy]);

    return (
        <div className="courses-page">
            <div className="courses-header">
                <div className="courses-header-content">
                    <p className="courses-subtitle">Our Library</p>
                    <h1 className="courses-title">Explore Our Courses</h1>
                    <p className="courses-count">{courses.length} courses available</p>
                </div>
                <Link href="/" className="courses-back-btn">← Back to Home</Link>
            </div>

            <div className="courses-filter-bar">
                <div className="courses-filter-actions">
                    <Link href="/categories" className="explore-categories-btn">
                        Explore by Category
                    </Link>
                    <button
                        className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <IconSearch size={16} /> Search {showFilters ? "✕" : ""}
                    </button>
                    <button
                        className={`filter-toggle-btn ${showSort ? "active" : ""}`}
                        onClick={() => setShowSort(!showSort)}
                    >
                        Sort {showSort ? "✕" : ""}
                    </button>
                </div>

                {showFilters && (
                    <div className="courses-search-wrapper">
                        <IconSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="courses-search-input"
                        />
                    </div>
                )}

                {showSort && (
                    <div className="courses-sort-row">
                        <button
                            className={`sort-option ${sortBy === "newest" ? "active" : ""}`}
                            onClick={() => { setSortBy("newest"); setShowSort(false); }}
                        >
                            Newest
                        </button>
                        <button
                            className={`sort-option ${sortBy === "price-low" ? "active" : ""}`}
                            onClick={() => { setSortBy("price-low"); setShowSort(false); }}
                        >
                            Price: Low → High
                        </button>
                        <button
                            className={`sort-option ${sortBy === "price-high" ? "active" : ""}`}
                            onClick={() => { setSortBy("price-high"); setShowSort(false); }}
                        >
                            Price: High → Low
                        </button>
                        <button
                            className={`sort-option ${sortBy === "rating" ? "active" : ""}`}
                            onClick={() => { setSortBy("rating"); setShowSort(false); }}
                        >
                            Top Rated
                        </button>
                    </div>
                )}

                <div className="courses-category-pills">
                    <button
                        className={`category-pill ${!selectedCategory ? "active" : ""}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </button>
                    {courseTypes.map((type) => (
                        <button
                            key={type.id}
                            className={`category-pill ${selectedCategory === type.id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(type.id)}
                            style={{ "--pill-color": type.color || "#6366f1" }}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="courses-container">
                <div className="courses-results-info">
                    Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> courses
                    {selectedCategory && (
                        <button className="clear-filter-chip" onClick={() => setSelectedCategory(null)}>
                            ✕ Clear
                        </button>
                    )}
                </div>

                <div className="courses-grid">
                    {filteredCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.courseUrlId || course.slug}`}
                            className="brutal-course-card"
                        >
                            <div className="brutal-course-image">
                                {course.courseImage ? (
                                    <img
                                        src={course.courseImage}
                                        alt={course.title}
                                        className="brutal-course-img"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="brutal-course-placeholder">
                                        <p className="brutal-course-placeholder-text">{course.title}</p>
                                    </div>
                                )}
                                {course.discountPercent > 0 && (
                                    <div className="brutal-course-discount">
                                        {Math.round(course.discountPercent)}% OFF
                                    </div>
                                )}
                            </div>

                            <div className="brutal-course-content">
                                <div className="brutal-course-meta">
                                    <span className="brutal-course-category">
                                        {course.courseType?.name || "General"}
                                    </span>
                                    {course.duration && (
                                        <span className="brutal-course-duration">
                                            <IconClock size={12} /> {course.duration}
                                        </span>
                                    )}
                                </div>

                                <h3 className="brutal-course-title">{course.title}</h3>

                                <div className="brutal-course-rating">
                                    <div className="brutal-course-stars">
                                        {Array.from({ length: Math.round(course.rating || 4.5) }).map((_, idx) => (
                                            <IconStar key={idx} size={13} color="#ffd400" />
                                        ))}
                                    </div>
                                    <span className="brutal-course-rating-text">
                                        {(course.rating || 4.5).toFixed(1)}
                                    </span>
                                </div>

                                <div className="brutal-course-pricing">
                                    <span className="brutal-course-price">₹{Number(course.offerPrice || 0).toFixed(0)}</span>
                                    {Number(course.originalPrice || 0) > Number(course.offerPrice || 0) && (
                                        <span className="brutal-course-original">₹{Number(course.originalPrice || 0).toFixed(0)}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="brutal-empty-state">
                        <div className="brutal-empty-icon">📚</div>
                        <h3>No Courses Found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button
                            className="reset-filters-btn"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(null);
                                setSortBy("newest");
                            }}
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .courses-filter-bar {
                    background: #fff;
                    border-bottom: 4px solid #000;
                    padding: 1rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    position: sticky;
                    top: 70px;
                    z-index: 40;
                }

                .courses-filter-actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .explore-categories-btn {
                    padding: 0.5rem 1rem;
                    background: #000;
                    color: #ffd400;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .explore-categories-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 4px 4px 0 #ffd400;
                }

                .filter-toggle-btn {
                    padding: 0.5rem 1rem;
                    background: #f5f5f5;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #000;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .filter-toggle-btn:hover {
                    background: #ffd400;
                    transform: translateY(-2px);
                }

                .filter-toggle-btn.active {
                    background: #ffd400;
                    box-shadow: 3px 3px 0 #000;
                }

                .courses-search-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    padding: 0.5rem 1rem;
                    max-width: 500px;
                    color: #000;
                }

                .courses-search-wrapper:focus-within {
                    box-shadow: 4px 4px 0 #ffd400;
                }

                .courses-search-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #000;
                    outline: none;
                }

                .courses-search-input::placeholder {
                    color: #666;
                }

                .courses-sort-row {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .sort-option {
                    padding: 0.4rem 0.8rem;
                    background: #f5f5f5;
                    border: 2px solid #000;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #000;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .sort-option:hover,
                .sort-option.active {
                    background: #000;
                    color: #ffd400;
                    transform: translateY(-1px);
                }

                .courses-category-pills {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .category-pill {
                    padding: 0.5rem 1rem;
                    background: #f5f5f5;
                    border: 2px solid #000;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #000;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .category-pill:hover {
                    background: var(--pill-color, #ffd400);
                    transform: translateY(-2px);
                }

                .category-pill.active {
                    background: #ffd400;
                    color: #000;
                    box-shadow: 3px 3px 0 #000;
                }

                .courses-results-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #333;
                }

                .courses-results-info strong {
                    color: #000;
                }

                .clear-filter-chip {
                    padding: 0.25rem 0.75rem;
                    background: #fee2e2;
                    border: 2px solid #ef4444;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #ef4444;
                    cursor: pointer;
                }

                .clear-filter-chip:hover {
                    background: #ef4444;
                    color: #fff;
                }

                .reset-filters-btn {
                    padding: 0.75rem 1.5rem;
                    background: #000;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .courses-filter-bar {
                        top: 60px;
                    }

                    .courses-filter-actions {
                        flex-direction: column;
                    }

                    .courses-category-pills {
                        overflow-x: auto;
                        flex-wrap: nowrap;
                        padding-bottom: 0.5rem;
                    }
                }

                [data-theme="dark"] .courses-filter-bar {
                    background: #111111;
                    border-bottom-color: #333;
                }

                [data-theme="dark"] .explore-categories-btn {
                    background: #ffd400;
                    color: #000;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .filter-toggle-btn {
                    background: #1a1a2e;
                    color: #ffffff;
                    border-color: #333;
                }

                [data-theme="dark"] .filter-toggle-btn:hover {
                    background: #ffd400;
                    color: #000;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .courses-search-wrapper {
                    background: #1a1a2e;
                    border-color: #ffd400;
                    color: #ffffff;
                }

                [data-theme="dark"] .courses-search-input {
                    color: #ffffff;
                }

                [data-theme="dark"] .courses-search-input::placeholder {
                    color: #888888;
                }

                [data-theme="dark"] .sort-option {
                    background: #1a1a2e;
                    color: #ffffff;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .sort-option:hover,
                [data-theme="dark"] .sort-option.active {
                    background: #ffd400;
                    color: #000000;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .category-pill {
                    background: #1a1a2e;
                    color: #ffffff;
                    border-color: #333;
                }

                [data-theme="dark"] .category-pill:hover,
                [data-theme="dark"] .category-pill.active {
                    background: #ffd400;
                    color: #000000;
                }

                [data-theme="dark"] .courses-results-info {
                    color: #b0b0b0;
                }

                [data-theme="dark"] .courses-results-info strong {
                    color: #ffd400;
                }

                .scroll-progress-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                    pointer-events: none;
                }

                .scroll-progress-bar {
                    height: 4px;
                    background: linear-gradient(90deg, #0084D1, #ffd400);
                    transition: width 0.1s ease;
                }

                `}</style>
        </div>
    );
}