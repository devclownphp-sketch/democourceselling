import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import BusinessProfileForm from "@/components/admin/BusinessProfileForm";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default function AdminSettingsPage() {
    return (
        <section className="stack-lg">
            <SiteSettingsForm />
            <BusinessProfileForm />
            <PasswordChangeForm />
        </section>
    );
}
