import VisitTracker from "@/components/VisitTracker";
import ContactForm from "@/components/ContactForm";
import { getBusinessProfile } from "@/lib/business-profile";

export const metadata = {
    title: "Contact Us",
};

export default async function ContactPage() {
    const businessProfile = await getBusinessProfile();

    return (
        <div className="contact-page">
            <VisitTracker />
            <div className="contact-header">
                <div className="contact-header-content">
                    <p className="contact-subtitle">Get in Touch</p>
                    <h1 className="contact-title">Contact Us</h1>
                    <p className="contact-desc">Have questions? We'd love to hear from you.</p>
                </div>
            </div>
            <section className="contact-container">
                <ContactForm businessProfile={businessProfile} />
            </section>
        </div>
    );
}
