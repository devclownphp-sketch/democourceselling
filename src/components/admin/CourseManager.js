"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    ["title", "Course Title", "\ud83d\udcdd"],
    ["shortDescription", "Short Description", "\ud83d\udcc4"],
    ["whatIs", "What is this course?", "\u2753"],
    ["whoCanJoin", "Who Can Join? (one per line)", "\ud83c\udf93"],
    ["syllabusTopics", "Syllabus & Topics (one per line)", "\ud83d\udcd1"],
    ["studyPlan", "How to Study (one per line)", "\ud83d\udcda"],
    ["jobsAfter", "Jobs After Course (one per line)", "\ud83d\udcbc"],
    ["startLearningText", "Start Learning text", "\ud83d\ude80"],
    ["duration", "Duration", "\u23f0"],
    ["level", "Level", "\ud83c\udfaf"],
    ["classType", "Class Type", "\ud83d\udcf9"],
    ["liveQna", "Live QnA", "\ud83d\udcac"],
    ["pdfNotes", "PDF Notes", "\ud83d\udcc2"],
    ["callSupport", "Call Support", "\ud83d\udcde"],
    ["socialPrompt", "Social Prompt", "\ud83d\udce3"],
    ["whatsappNumber", "WhatsApp (with country code)", "\ud83d\udcf1"],
];

const textareas = new Set([
    "shortDescription", "whatIs", "whoCanJoin", "syllabusTopics",
    "studyPlan", "jobsAfter", "startLearningText",
]);

export default function CourseManager({ initialCourses }) {
    const [courses, setCourses] = useState(initialCourses);
    const [form, setForm] = useState(defaultCourse);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = useMemo(() => (editingId ? "\u270f\ufe0f Update Course" : "\u2795 Create Course"), [editingId]);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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

    const resetForm = () => { setEditingId(""); setForm(defaultCourse); setError(""); setSuccess(""); };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const payload = { ...form, originalPrice: Number(form.originalPrice), offerPrice: Number(form.offerPrice) };

        try {
            const response = await fetch(editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save course.");

            if (editingId) {
                setCourses((prev) => prev.map((item) => (item.id === editingId ? data.course : item)));
                setSuccess("\u2705 Course updated successfully!");
            } else {
                setCourses((prev) => [data.course, ...prev]);
                setSuccess("\u2705 Course created successfully!");
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
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="panel form-grid"
                onSubmit={submit}
            >
                <h3>{heading}</h3>
                {fieldGroups.map(([name, label, emoji]) => (
                    <label key={name}>
                        {emoji} {label}
                        {textareas.has(name) ? (
                            <textarea rows={name === "shortDescription" ? 3 : 5} name={name} value={form[name]} onChange={onChange} required />
                        ) : (
                            <input name={name} value={form[name]} onChange={onChange} required />
                        )}
                    </label>
                ))}

                <div className="price-row">
                    <label>
                        {"\ud83d\udcb0"} Original Price
                        <input type="number" min="0" step="0.01" name="originalPrice" value={form.originalPrice} onChange={onChange} required />
                    </label>
                    <label>
                        {"\ud83c\udf89"} Offer Price
                        <input type="number" min="0" step="0.01" name="offerPrice" value={form.offerPrice} onChange={onChange} required />
                    </label>
                </div>

                <label className="inline-check">
                    <input type="checkbox" name="lifetimeAccess" checked={form.lifetimeAccess} onChange={onChange} />
                    {"\u267e\ufe0f"} Lifetime access
                </label>
                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    {"\ud83d\udc41\ufe0f"} Show on front page
                </label>

                <div className="inline-actions">
                    <motion.button className="btn-primary" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {loading ? "\u23f3 Saving..." : heading}
                    </motion.button>
                    {editingId && (
                        <button className="btn-ghost" type="button" onClick={resetForm}>
                            {"\u274c"} Cancel
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">{"\u26a0\ufe0f"} {error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>{"\ud83d\udcda"} All Courses ({courses.length})</h3>
                <div className="table-wrap">
                    <table className="course-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Clicks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{"\ud83d\udcd6"} {course.title}</td>
                                    <td>
                                        <span className="price-green">INR {course.offerPrice}</span>
                                        <span className="muted-text"> / {course.originalPrice}</span>
                                    </td>
                                    <td>
                                        <span className={course.isActive ? "status-active" : "status-hidden"}>
                                            {course.isActive ? "\ud83d\udfe2 Active" : "\ud83d\udd34 Hidden"}
                                        </span>
                                    </td>
                                    <td><span className="click-badge">{course.enrollClicks}</span></td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(course)}>
                                                {"\u270f\ufe0f"} Edit
                                            </button>
                                            <button type="button" className="btn-danger" onClick={() => removeCourse(course.id)}>
                                                {"\ud83d\uddd1\ufe0f"} Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr><td colSpan={5} className="empty-row">{"\ud83d\udce6"} No courses yet. Create your first one above!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
