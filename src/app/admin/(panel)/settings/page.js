import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import BusinessProfileForm from "@/components/admin/BusinessProfileForm";

export default function AdminSettingsPage() {
    return (
        <section className="stack-lg">
            <BusinessProfileForm />
            <PasswordChangeForm />
        </section>
    );
}
