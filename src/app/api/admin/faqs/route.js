import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    await requireAdminApi();

    const faqs = await prisma.fAQ.findMany({
        orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ faqs });
}

export async function POST(request) {
    await requireAdminApi();

    try {
        const body = await request.json();
        const { question, answer, sortOrder = 0 } = body;

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
        }

        const faq = await prisma.fAQ.create({
            data: { question, answer, sortOrder },
        });

        return NextResponse.json({ faq });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
