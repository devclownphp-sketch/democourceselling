import { redirect } from "next/navigation";
import SubAdminLoginForm from "@/components/admin/SubAdminLoginForm";
import { getSessionSubAdmin } from "@/lib/admin-auth";

export const metadata = {
    title: "SubAdmin Login",
};

export default async function SubAdminLoginPage() {
    const subadmin = await getSessionSubAdmin();
    if (subadmin) {
        redirect("/admin");
    }

    return (
        <div className="admin-login-wrap">
            <SubAdminLoginForm />
        </div>
    );
}
