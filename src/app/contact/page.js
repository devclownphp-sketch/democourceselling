import VisitTracker from "@/components/VisitTracker";
import ContactForm from "@/components/ContactForm";
import { getBusinessProfile } from "@/lib/business-profile";

export const metadata = {
    title: "Contact Us",
};

export default async function ContactPage() {
    const businessProfile = await getBusinessProfile();

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            <VisitTracker />
            <section className="mx-auto w-[min(1180px,94vw)] py-10 md:py-14">
                <ContactForm businessProfile={businessProfile} />
            </section>
        </div>
    );
}
