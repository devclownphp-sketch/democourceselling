import VisitTracker from "@/components/VisitTracker";
import ContactForm from "@/components/ContactForm";

export const metadata = {
    title: "Contact Us",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            <VisitTracker />
            <section className="mx-auto w-[min(900px,94vw)] py-12 md:py-16">
                <div className="mb-8 space-y-3">
                    <p className="text-sm uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--brand)" }}>Contact Us</p>
                    <h1 className="text-3xl font-bold md:text-4xl">Talk to our team</h1>
                    <p style={{ color: "var(--text-muted)" }}>Fill this form and we will get in touch with you soon.</p>
                </div>
                <ContactForm />
            </section>
        </div>
    );
}
