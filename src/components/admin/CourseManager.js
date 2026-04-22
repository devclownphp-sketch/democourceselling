"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PDFUploader from "./PDFUploader";

const defaultCourse = {
    title: "",
    courseTypeId: "",
    rating: "4.5",
    discountPercent: "100",
    courseImage: "",
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
    ["title", "Course Title", "📝"],
    ["shortDescription", "Short Description", "📄"],
    ["whatIs", "What is this course?", "❓"],
    ["whoCanJoin", "Who Can Join? (one per line)", "🎓"],
    ["syllabusTopics", "Syllabus & Topics (one per line)", "📋"],
    ["studyPlan", "How to Study (one per line)", "📚"],
    ["jobsAfter", "Jobs After Course (one per line)", "💼"],
    ["startLearningText", "Start Learning text", "🚀"],
    ["duration", "Duration", "⏰"],
    ["level", "Level", "🏆"],
    ["classType", "Class Type", "🎬"],
    ["liveQna", "Live QnA", "💬"],
    ["pdfNotes", "PDF Notes", "📂"],
    ["callSupport", "Call Support", "📞"],
    ["socialPrompt", "Social Prompt", "📢"],
    ["whatsappNumber", "WhatsApp (with country code)", "📱"],
];

const textareas = new Set([
    "shortDescription", "whatIs", "whoCanJoin", "syllabusTopics",
    "studyPlan", "jobsAfter", "startLearningText",
]);

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read selected image."));
        reader.readAsDataURL(file);
    });
}

function loadImage(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Selected file is not a valid image."));
        image.src = source;
    });
}

async function resizeToCover(dataUrl) {
    const image = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = IMAGE_WIDTH;
    canvas.height = IMAGE_HEIGHT;
    const context = canvas.getContext("2d");

    if (!context) throw new Error("Image processing is not supported in this browser.");

    const scale = Math.max(IMAGE_WIDTH / image.width, IMAGE_HEIGHT / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (IMAGE_WIDTH - drawWidth) / 2;
    const offsetY = (IMAGE_HEIGHT - drawHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    return canvas.toDataURL("image/jpeg", 0.86);
}

function calculateOfferPrice(originalPrice, discountPercent) {
    const original = Number(originalPrice || 0);
    const off = Number(discountPercent || 0);
    if (!Number.isFinite(original) || !Number.isFinite(off)) return "0.00";
    const clampedOff = Math.max(0, Math.min(100, off));
    return (original * (1 - clampedOff / 100)).toFixed(2);
}

export default function CourseManager({ initialCourses, courseTypes = [] }) {
    const [courses, setCourses] = useState(initialCourses);
    const [form, setForm] = useState(defaultCourse);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = useMemo(() => (editingId ? "📝 Update Course" : "➕ Create Course"), [editingId]);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (name === "originalPrice" || name === "discountPercent") {
            setForm((prev) => {
                const next = { ...prev, [name]: value };
                return {
                    ...next,
                    offerPrice: calculateOfferPrice(next.originalPrice, next.discountPercent),
                };
            });
            return;
        }

        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const startEdit = (course) => {
        setEditingId(course.id);
        setForm({
            ...course,
            courseTypeId: course.courseTypeId || "",
            rating: String(course.rating ?? 4.5),
            discountPercent: String(course.discountPercent ?? 0),
            originalPrice: String(course.originalPrice),
            offerPrice: String(course.offerPrice),
            lifetimeAccess: Boolean(course.lifetimeAccess),
            isActive: Boolean(course.isActive),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => { setEditingId(""); setForm({ ...defaultCourse, offerPrice: calculateOfferPrice(defaultCourse.originalPrice, defaultCourse.discountPercent) }); setError(""); setSuccess(""); };

    const onPickImage = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setError("");
            const dataUrl = await readFileAsDataUrl(file);
            const resized = await resizeToCover(dataUrl);
            setForm((prev) => ({ ...prev, courseImage: resized }));
        } catch (imageError) {
            setError(imageError.message || "Could not process selected image.");
        } finally {
            event.target.value = "";
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const payload = {
            ...form,
            rating: Number(form.rating),
            discountPercent: Number(form.discountPercent),
            originalPrice: Number(form.originalPrice),
            offerPrice: Number(calculateOfferPrice(form.originalPrice, form.discountPercent)),
        };

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
                setSuccess("✅ Course updated successfully!");
            } else {
                setCourses((prev) => [data.course, ...prev]);
                setSuccess("✅ Course created successfully!");
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
                <div className="price-row">
                    <label>
                        🗂️ Course Type
                        <select name="courseTypeId" value={form.courseTypeId} onChange={onChange} required>
                            <option value="">Select course type</option>
                            {courseTypes.map((courseType) => (
                                <option key={courseType.id} value={courseType.id}>{courseType.name}</option>
                            ))}
                        </select>
                        <span className="muted-text">Need a new type? Go to <Link href="/admin/course-types" style={{ color: "var(--brand)" }}>Course Types</Link>.</span>
                    </label>
                    <label>
                        ⭐ Rating (1 to 5)
                        <input type="number" min="1" max="5" step="0.1" name="rating" value={form.rating} onChange={onChange} required />
                    </label>
                </div>
                <label>
                    🖼️ Course Banner Image ({IMAGE_WIDTH}x{IMAGE_HEIGHT})
                    <input type="file" accept="image/*" onChange={onPickImage} />
                    <input name="courseImage" value={form.courseImage} onChange={onChange} placeholder="Or paste image URL/data URL" />
                    {form.courseImage ? (
                        <>
                            <img
                                src={form.courseImage}
                                alt="Course preview"
                                style={{ width: "100%", maxWidth: "380px", aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`, objectFit: "cover", borderRadius: "0.7rem", border: "1px solid var(--line)", marginTop: "0.35rem" }}
                            />
                            <button type="button" className="btn-ghost" onClick={() => setForm((prev) => ({ ...prev, courseImage: "" }))}>Clear Image</button>
                        </>
                    ) : (
                        <span className="muted-text">Selected images are auto-resized and cropped to a fixed card size.</span>
                    )}
                </label>
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
                        💰 Original Price
                        <input type="number" min="0" step="0.01" name="originalPrice" value={form.originalPrice} onChange={onChange} required />
                    </label>
                    <label>
                        🎉 OFF (%)
                        <input type="number" min="0" max="100" step="0.1" name="discountPercent" value={form.discountPercent} onChange={onChange} required />
                    </label>
                </div>

                <div className="price-row">
                    <label>
                        💸 Discounted Price (Auto)
                        <input type="number" name="offerPrice" value={calculateOfferPrice(form.originalPrice, form.discountPercent)} readOnly />
                    </label>
                    <div className="muted-text" style={{ alignSelf: "end" }}>
                        Discounted price is automatically calculated from Original Price and OFF(%).
                    </div>
                </div>

                <label className="inline-check">
                    <input type="checkbox" name="lifetimeAccess" checked={form.lifetimeAccess} onChange={onChange} />
                    ♾️ Lifetime access
                </label>
                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    👁️ Show on front page
                </label>

                <div className="pdf-upload-section">
                    <h4>📂 PDF Notes for this Course</h4>
                    <p className="muted-text">Upload PDF files that students can download from the course page.</p>
                    <PDFUploader courseId={editingId} />
                </div>

                <div className="inline-actions">
                    <motion.button className="btn-primary" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {loading ? "⏳ Saving..." : heading}
                    </motion.button>
                    {editingId && (
                        <button className="btn-ghost" type="button" onClick={resetForm}>
                            ❌ Cancel
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">⚠️ {error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>📚 All Courses ({courses.length})</h3>
                <div className="table-wrap">
                    <table className="course-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Rating</th>
                                <th>Price</th>
                                <th>OFF</th>
                                <th>Status</th>
                                <th>Clicks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>📖 {course.title}</td>
                                    <td>{course.courseType?.name || "-"}</td>
                                    <td>{Number(course.rating || 0).toFixed(1)}</td>
                                    <td>
                                        <span className="price-green">INR {course.offerPrice}</span>
                                        <span className="muted-text"> / {course.originalPrice}</span>
                                    </td>
                                    <td>{Number(course.discountPercent || 0).toFixed(1)}%</td>
                                    <td>
                                        <span className={course.isActive ? "status-active" : "status-hidden"}>
                                            {course.isActive ? "🟢 Active" : "🔴 Hidden"}
                                        </span>
                                    </td>
                                    <td><span className="click-badge">{course.enrollClicks}</span></td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(course)}>
                                                ✏️ Edit
                                            </button>
                                            <button type="button" className="btn-danger" onClick={() => removeCourse(course.id)}>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr><td colSpan={8} className="empty-row">📦 No courses yet. Create your first one above!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}