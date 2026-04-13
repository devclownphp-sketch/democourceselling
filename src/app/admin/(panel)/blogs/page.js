import BlogManager from "@/components/admin/BlogManager";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata = {
    title: "Blog Management - Admin",
};

export default async function AdminBlogsPage() {
    await requireAdmin();

    return <BlogManager />;
}
