import VisitTracker from "@/components/VisitTracker";
import ContactForm from "@/components/ContactForm";

export const metadata = {
    title: "Contact Us",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <VisitTracker />
            <section className="mx-auto w-[min(900px,94vw)] py-12 md:py-16">
                <div className="mb-8 space-y-3">
                    <p className="text-sm uppercase tracking-[0.14em] text-orange-200">Contact Us</p>
                    <h1 className="text-3xl font-bold md:text-4xl">Talk to our team</h1>
                    <p className="text-slate-300">Fill this form and we will get in touch with you soon.</p>
                </div>
                <ContactForm />
            </section>
        </div>
    );
}
