"use client";

import { useMemo, useState } from "react";

const defaultCourse = {
    title: "",
    shortDescription: "",
    whatIs: "",
    whoCanJoin: "",
    syllabusTopics: "",
    studyPlan: "",
    jobsAfter: "",
    startLearningText: "",
    originalPrice: "2999",
    offerPrice: "0",
    duration: "3 Months Duration",
    level: "Beginner to Advance Level",
    classType: "Video Recording Classes",
    liveQna: "Live QNA on Every Sunday 8:00 PM",
    pdfNotes: "PDF Notes Support",
    callSupport: "Call Support Morning 10 to 12",
    lifetimeAccess: true,
    socialPrompt: "Follow on social media",
    whatsappNumber: "919999999999",
    isActive: true,
};

const fieldGroups = [
    ["title", "Course Title"],
    ["shortDescription", "Short Description"],
    ["whatIs", "What is this course?"],
    ["whoCanJoin", "Who Can Join? (one item per line)"],
    ["syllabusTopics", "Course Syllabus & Topics (one item per line)"],
    ["studyPlan", "How to Study (one item per line)"],
    ["jobsAfter", "Jobs After Course (one item per line)"],
    ["startLearningText", "Start Learning section text"],
    ["duration", "Duration"],
    ["level", "Level"],
    ["classType", "Class Type"],
    ["liveQna", "Live QnA"],
    ["pdfNotes", "PDF Notes"],
    ["callSupport", "Call Support"],
    ["socialPrompt", "Social Prompt"],
    ["whatsappNumber", "WhatsApp Number (with country code)"],
];

const textareas = new Set([
    "shortDescription",
    "whatIs",
    "whoCanJoin",
    "syllabusTopics",
    "studyPlan",
    "jobsAfter",
    "startLearningText",
]);

export default function CourseManager({ initialCourses }) {
    const [courses, setCourses] = useState(initialCourses);
    const [form, setForm] = useState(defaultCourse);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const heading = useMemo(() => (editingId ? "Update Course" : "Create Course"), [editingId]);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const startEdit = (course) => {
        setEditingId(course.id);
        setForm({
            ...course,
            originalPrice: String(course.originalPrice),
            offerPrice: String(course.offerPrice),
            lifetimeAccess: Boolean(course.lifetimeAccess),
            isActive: Boolean(course.isActive),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultCourse);
        setError("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const payload = {
            ...form,
            originalPrice: Number(form.originalPrice),
            offerPrice: Number(form.offerPrice),
        };

        try {
            const response = await fetch(editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                const details = data?.details
                    ? Object.entries(data.details)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : String(messages || "")}`)
                        .join(" | ")
                    : "";
                throw new Error(details ? `${data.error || "Could not save course."} (${details})` : data.error || "Could not save course.");
            }

            if (editingId) {
                setCourses((prev) => prev.map((item) => (item.id === editingId ? data.course : item)));
            } else {
                setCourses((prev) => [data.course, ...prev]);
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not save course.");
        } finally {
            setLoading(false);
        }
    };

    const removeCourse = async (id) => {
        if (!window.confirm("Delete this course?")) return;

        try {
            const response = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setCourses((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Could not delete course.");
        }
    };

    return (
        <div className="stack-lg">
            <form className="panel form-grid" onSubmit={submit}>
                <h3>{heading}</h3>
                {fieldGroups.map(([name, label]) => (
                    <label key={name}>
                        {label}
                        {textareas.has(name) ? (
                            <textarea rows={name === "shortDescription" ? 3 : 5} name={name} value={form[name]} onChange={onChange} required />
                        ) : (
                            <input name={name} value={form[name]} onChange={onChange} required />
                        )}
                    </label>
                ))}

                <div className="price-row">
                    <label>
                        Original Price
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="originalPrice"
                            value={form.originalPrice}
                            onChange={onChange}
                            required
                        />
                    </label>
                    <label>
                        Offer Price
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="offerPrice"
                            value={form.offerPrice}
                            onChange={onChange}
                            required
                        />
                    </label>
                </div>

                <label className="inline-check">
                    <input type="checkbox" name="lifetimeAccess" checked={form.lifetimeAccess} onChange={onChange} />
                    Lifetime access
                </label>
                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    Show on front page
                </label>

                <div className="inline-actions">
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? "Saving..." : heading}
                    </button>
                    {editingId ? (
                        <button className="btn-ghost" type="button" onClick={resetForm}>
                            Cancel Editing
                        </button>
                    ) : null}
                </div>

                {error ? <p className="error-text">{error}</p> : null}
            </form>

            <section className="panel">
                <h3>All Courses</h3>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Enroll Clicks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>
                                        INR {course.offerPrice}
                                        <span className="muted-text"> / INR {course.originalPrice}</span>
                                    </td>
                                    <td>{course.isActive ? "Active" : "Hidden"}</td>
                                    <td>{course.enrollClicks}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(course)}>
                                                Edit
                                            </button>
                                            <button type="button" className="btn-danger" onClick={() => removeCourse(course.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>No courses yet.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
