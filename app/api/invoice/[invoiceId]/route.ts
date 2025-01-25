import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import jspdf, { jsPDF } from "jspdf";
import { FormatCurrency } from "@/app/utils/formatcurrency";

export async function GET(request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
    const { invoiceId } = await params;


    // Fetch invoice data
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select: {
            invoiceName: true,
            invoiceItemDescription: true,
            InvoiceNumber: true,
            invoiceItemRate: true,
            invoiceItemQuantity: true,
            Total: true,
            status: true,
            clientName: true,
            clientEmail: true,
            fromAddress: true,
            fromEmail: true,
            fromName: true,
            date: true,
            dueDate: true,
            currency: true,
            clientAddress: true,
            note: true,
        }
    });

    if (!data) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    pdf.setFont("helvetica");

    // Title
    pdf.setFontSize(24);
    pdf.text(data.invoiceName, 20, 20);

    // From Section
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("From", 20, 40);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text([data.fromName, data.fromEmail, data.fromAddress].join("\n"), 20, 45);

    // Bill To Section
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Bill To", 120, 40);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text([data.clientName, data.clientEmail, data.clientAddress].join("\n"), 120, 45);

    // Invoice Details Section
    pdf.setFontSize(10);
    pdf.text(`Invoice Number: #${data.InvoiceNumber}`, 120, 70);
    pdf.text(`Date: ${new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(data.date))}`, 120, 75);
    pdf.text(`Due Date: ${new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(data.dueDate))}`, 120, 80);

    // Item Table Header
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", 20, 100);
    pdf.text("Quantity", 100, 100);
    pdf.text("Rate", 130, 100);
    pdf.text("Total", 160, 100);

    // Draw header line
    pdf.line(20, 102, 190, 102);

    // Item Details
    pdf.setFont("helvetica", "normal");
    pdf.text(data.invoiceItemDescription, 20, 110);
    pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
    pdf.text(FormatCurrency(data.invoiceItemRate), 130, 110);
    pdf.text(FormatCurrency(data.Total), 160, 110);

    // Draw a line after the items
    pdf.line(20, 115, 190, 115);

    // Total Section
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total (${data.currency})`, 130, 130);
    pdf.text(FormatCurrency(data.Total), 160, 130);

    // Note Section
    if (data.note) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Note:", 20, 150);
        pdf.text(data.note, 20, 155);
    }

    // Add Footer with company name or page number (optional)
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("Your Company Name | www.company.com", 20, 290);
    pdf.text(`Page 1 of 1`, 180, 290, { align: 'right' });

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
        headers: {
            "content-type": "application/pdf",
            "content-disposition": "inline"
        },
    });
}
