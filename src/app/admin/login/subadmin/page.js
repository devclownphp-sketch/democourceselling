import { redirect } from "next/navigation";

export const metadata = {
    title: "Login - Panel Access",
};

export default async function SubAdminLoginPage() {
    redirect("/admin/login");
}
