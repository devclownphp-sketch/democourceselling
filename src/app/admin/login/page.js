import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getSessionAdmin } from "@/lib/admin-auth";

export const metadata = {
    title: "Admin Login",
};

export default async function AdminLoginPage() {
    const admin = await getSessionAdmin();
    if (admin) {
        redirect("/admin");
    }

    return (
        <div className="admin-login-wrap">
            <LoginForm />
        </div>
    );
}
