import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import BusinessProfileForm from "@/components/admin/BusinessProfileForm";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import StorageManager from "@/components/admin/StorageManager";

export default function AdminSettingsPage() {
    return (
        <section className="stack-lg">
            <SiteSettingsForm />
            <StorageManager />
            <BusinessProfileForm />
            <PasswordChangeForm />
        </section>
    );
}
