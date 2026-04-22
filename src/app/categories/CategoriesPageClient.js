"use client";

import { useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/brutalist/CourseCard";
import { IconFilter } from "@/components/Icons";

export default function CategoriesPageClient({ courseTypes = [], courses = [] }) {
    const [selectedType, setSelectedType] = useState(null);

        const filteredCourses = selectedType
        ? courses.filter(course => course.courseTypeId === selectedType)
        : courses;

    const totalCourses = courses.length;

    return (
        <div className="categories-page">
            {/* Header */}
            <div className="categories-header">
                <div className="categories-header-content">
                    <h1>Explore Categories</h1>
                    <p>Find the perfect course for your learning journey</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="categories-main">
                {/* Sidebar - Simple category list */}
                <aside className="categories-sidebar">
                    <div className="sidebar-header">
                        <IconFilter size={20} />
                        <h3>Categories</h3>
                    </div>
                    <div className="category-list">
                        <button
                            className={`category-item ${!selectedType ? "active" : ""}`}
                            onClick={() => setSelectedType(null)}
                        >
                            <span className="category-dot" style={{ background: "#ffd400" }} />
                            <span>All Courses</span>
                            <span className="category-count">{totalCourses}</span>
                        </button>
                        {courseTypes.map((type) => {
                            const count = courses.filter(c => c.courseTypeId === type.id).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={type.id}
                                    className={`category-item ${selectedType === type.id ? "active" : ""}`}
                                    onClick={() => setSelectedType(type.id)}
                                >
                                    <span
                                        className="category-dot"
                                        style={{ background: type.color || "#6366f1" }}
                                    />
                                    <span>{type.name}</span>
                                    <span className="category-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Content - Course grid */}
                <div className="categories-content">
                    <div className="categories-results-header">
                        <p className="results-count">
                            Showing <strong>{filteredCourses.length}</strong> of <strong>{totalCourses}</strong> courses
                        </p>
                        {selectedType && (
                            <button
                                className="clear-filter-btn"
                                onClick={() => setSelectedType(null)}
                            >
                                Clear filter ✕
                            </button>
                        )}
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className="courses-grid">
                            {filteredCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-courses">
                            <div className="no-courses-icon">📚</div>
                            <h3>No courses found</h3>
                            <p>Try selecting a different category</p>
                            <button
                                className="reset-btn"
                                onClick={() => setSelectedType(null)}
                            >
                                Show All Courses
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .categories-page {
                    min-height: 100vh;
                    background: #f8f9fc;
                }

                .categories-header {
                    background: #ffd400;
                    border-bottom: 4px solid #000;
                    padding: 3rem 1.5rem;
                }

                .categories-header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .categories-header h1 {
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                    margin: 0;
                }

                .categories-header p {
                    margin: 0.5rem 0 0;
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

                .categories-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                    display: grid;
                    grid-template-columns: 260px 1fr;
                    gap: 2rem;
                }

                .categories-sidebar {
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 8px 8px 0 #000;
                    height: fit-content;
                    position: sticky;
                    top: 140px;
                }

                .sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 3px solid #000;
                }

                .sidebar-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .category-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .category-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: transparent;
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-align: left;
                    transition: all 0.2s ease;
                }

                .category-item:hover {
                    background: #f5f5f5;
                }

                .category-item.active {
                    background: #ffd400;
                    border-color: #000;
                    box-shadow: 3px 3px 0 #000;
                }

                .category-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid #000;
                }

                .category-item span:nth-child(2) {
                    flex: 1;
                }

                .category-count {
                    background: #000;
                    color: #fff;
                    padding: 0.15rem 0.5rem;
                    border-radius: 999px;
                    font-size: 0.7rem;
                    font-weight: 700;
                }

                .categories-content {
                    min-width: 0;
                }

                .categories-results-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .results-count {
                    margin: 0;
                    font-size: 0.9rem;
                    color: #666;
                }

                .clear-filter-btn {
                    padding: 0.4rem 0.8rem;
                    background: #fee2e2;
                    border: 2px solid #ef4444;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #ef4444;
                    cursor: pointer;
                }

                .clear-filter-btn:hover {
                    background: #ef4444;
                    color: #fff;
                }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .no-courses {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 20px;
                }

                .no-courses-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .no-courses h3 {
                    margin: 0 0 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .no-courses p {
                    margin: 0 0 1.5rem;
                    color: #666;
                }

                .reset-btn {
                    padding: 0.75rem 1.5rem;
                    background: #000;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .reset-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                @media (max-width: 900px) {
                    .categories-main {
                        grid-template-columns: 1fr;
                    }

                    .categories-sidebar {
                        position: static;
                    }

                    .category-list {
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                    .category-item span:nth-child(2) {
                        display: none;
                    }
                }

                /* Dark Mode */
                [data-theme="dark"] .categories-page {
                    background: #0a0a0f;
                }

                [data-theme="dark"] .categories-header {
                    background: #1a1a2e;
                    border-bottom-color: #ffd400;
                }

                [data-theme="dark"] .categories-header h1,
                [data-theme="dark"] .categories-header p {
                    color: #ffffff;
                }

                [data-theme="dark"] .categories-sidebar {
                    background: #1a1a2e;
                    border-color: #ffd400;
                    box-shadow: 8px 8px 0 #ffd40033;
                }

                [data-theme="dark"] .sidebar-header {
                    border-bottom-color: #ffd400;
                }

                [data-theme="dark"] .sidebar-header h3 {
                    color: #ffffff;
                }

                [data-theme="dark"] .category-item {
                    color: #ffffff;
                }

                [data-theme="dark"] .category-item:hover {
                    background: #252542;
                }

                [data-theme="dark"] .category-count {
                    background: #ffd400;
                    color: #000;
                }

                [data-theme="dark"] .results-count {
                    color: #b0b0b0;
                }

                [data-theme="dark"] .results-count strong {
                    color: #ffd400;
                }

                [data-theme="dark"] .no-courses {
                    background: #1a1a2e;
                    border-color: #ffd400;
                }

                [data-theme="dark"] .no-courses h3 {
                    color: #ffffff;
                }

                [data-theme="dark"] .no-courses p {
                    color: #b0b0b0;
                }

                [data-theme="dark"] .reset-btn {
                    background: #ffd400;
                    color: #000;
                }
            `}</style>
        </div>
    );
}
