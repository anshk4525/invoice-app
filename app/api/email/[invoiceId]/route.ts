import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST( request: Request,
    {params}:{params:Promise<{invoiceId : string}>}){
    try {
        const session = await requireUser();

    const {invoiceId}=  await params;

    const invoiceData = await prisma.invoice.findUnique({
        where:{
            id: invoiceId,
            userId: session.user?.id
        },
    })
    if(!invoiceData){
        return NextResponse.json({error: "Invoice not found"},{status: 404});
    }

    const sender = {
          email: "hello@demomailtrap.com",
          name: "Ansh Kumar",
        };
        
        await emailClient.send({
          from: sender,
          to: [{ email: "anshk4525@gmail.com" }], // submission.value.clientEmail
          
          template_uuid: "dccbd610-e4ec-437c-b551-d36ed3248c4a",
    template_variables: {
      "first_name": invoiceData.clientName
    }
        });
        return NextResponse.json({message: "Email sent successfully"},{status: 200});
    } catch (error) {
        console.log(error)
    }
}