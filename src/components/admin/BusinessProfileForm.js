"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
    businessName: "",
    supportEmail: "",
    supportPhone: "",
    addressLine: "",
    contactHeadline: "",
    contactSubtext: "",
    mapEmbedUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
};

export default function BusinessProfileForm() {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchProfile() {
            try {
                const response = await fetch("/api/admin/business-profile");
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Could not load business profile.");
                if (!ignore) setForm({ ...initialState, ...data.profile });
            } catch (fetchError) {
                if (!ignore) setError(fetchError.message || "Could not load business profile.");
            } finally {
                if (!ignore) setFetching(false);
            }
        }

        fetchProfile();
        return () => {
            ignore = true;
        };
    }, []);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/business-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save business profile.");
            setForm({ ...initialState, ...data.profile });
            setSuccess("Business contact details updated successfully.");
        } catch (submitError) {
            setError(submitError.message || "Could not save business profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="panel form-grid"
            onSubmit={onSubmit}
        >
            <h3>Business Contact Details</h3>

            <div className="price-row">
                <label>
                    Business Name
                    <input name="businessName" value={form.businessName} onChange={onChange} required />
                </label>
                <label>
                    Support Email
                    <input type="email" name="supportEmail" value={form.supportEmail} onChange={onChange} required />
                </label>
            </div>

            <div className="price-row">
                <label>
                    Support Phone
                    <input name="supportPhone" value={form.supportPhone} onChange={onChange} required />
                </label>
                <label>
                    Address
                    <input name="addressLine" value={form.addressLine} onChange={onChange} required />
                </label>
            </div>

            <label>
                Contact Section Heading
                <input name="contactHeadline" value={form.contactHeadline} onChange={onChange} required />
            </label>

            <label>
                Contact Section Subtext
                <textarea rows={2} name="contactSubtext" value={form.contactSubtext} onChange={onChange} required />
            </label>

            <label>
                Google Map Embed URL
                <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={onChange} placeholder="https://www.google.com/maps/embed?..." />
            </label>

            <div className="price-row">
                <label>
                    Twitter URL
                    <input name="twitterUrl" value={form.twitterUrl} onChange={onChange} />
                </label>
                <label>
                    Facebook URL
                    <input name="facebookUrl" value={form.facebookUrl} onChange={onChange} />
                </label>
                <label>
                    Instagram URL
                    <input name="instagramUrl" value={form.instagramUrl} onChange={onChange} />
                </label>
            </div>

            <div className="price-row">
                <label>
                    LinkedIn URL
                    <input name="linkedinUrl" value={form.linkedinUrl} onChange={onChange} />
                </label>
                <label>
                    YouTube URL
                    <input name="youtubeUrl" value={form.youtubeUrl} onChange={onChange} />
                </label>
            </div>

            <button className="btn-primary" type="submit" disabled={loading || fetching}>
                {fetching ? "Loading..." : loading ? "Saving..." : "Update Contact Details"}
            </button>

            <AnimatePresence>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">{error}</motion.p>}
                {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
            </AnimatePresence>
        </motion.form>
    );
}
