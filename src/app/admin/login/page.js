import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getSessionAdmin, getSessionSubAdmin } from "@/lib/admin-auth";

export const metadata = {
    title: "Login - Panel Access",
};

export default async function AdminLoginPage() {
    const admin = await getSessionAdmin();
    const subadmin = await getSessionSubAdmin();

    if (admin) {
        redirect("/admin");
    }

    if (subadmin && subadmin.urlId) {
        redirect(`/${subadmin.urlId}/dashboard`);
    }

    return (
        <div className="admin-login-wrap">
            <LoginForm />
        </div>
    );
}
