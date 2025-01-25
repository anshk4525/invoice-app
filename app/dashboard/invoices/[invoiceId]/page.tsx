import { EditInvoice } from "@/app/components/Editinvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound } from "next/navigation";

async function getData(invoiceId: string, userId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId: userId,
        },
    });
    if (!data) {
        return null;
    }
    return data;
}

type Params = { invoiceId: string };

export default async function EditInvoiceRoute({ params }: { params: Params }) {
    const { invoiceId } = await params;
    const session = await requireUser();
    const data = await getData(invoiceId, session.user?.id as string);

    if (!data) {
        return notFound();
    }

    return <EditInvoice data={data} />;
}
