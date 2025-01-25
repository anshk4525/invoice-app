"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { InvoiceSchema, OnboardingSchema } from "./utils/zodschema";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { FormatCurrency } from "./utils/formatcurrency";

// Define types for the functions
interface OnboardingData {
  firstName: string;
  lastName: string;
  address: string;
}

interface InvoiceData {
  clientAddress: string;
  clientEmail: string;
  clientName: string;
  currency: string;
  date: string;
  dueDate: string;
  fromAddress: string;
  fromEmail: string;
  fromName: string;
  invoiceName: string;
  invoiceItemDescription: string;
  invoiceItemQuantity: number;
  invoiceItemRate: number;
  InvoiceNumber: string;
  status: string;
  Total: number;
  note: string;
}

// Onboarding function to update user info
export async function OnboardUser(prevState: any, formData: FormData): Promise<any> {
  const session = await requireUser(); // Ensure the user is authenticated

  // Validate the form data using OnboardingSchema
  const submission = parseWithZod(formData, {
    schema: OnboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply(); // Return validation errors if any
  }

  // Update user details in the database
  await prisma.user.update({
    where: {
      id: session.user?.id, // Update the user based on the session ID
    },
    data: {
      firstname: submission.value.firstName,
      lastname: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard"); // Redirect to the dashboard after successful update
}

// Function to create an invoice
export async function CreateInvoices(prevState: any, formData: FormData): Promise<any> {
  const session = await requireUser(); // Ensure the user is authenticated

  // Validate the form data using InvoiceSchema
  const submission = parseWithZod(formData, {
    schema: InvoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply(); // Return validation errors if any
  }

  // Create a new invoice in the database
 const data= await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceName: submission.value.invoiceName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      InvoiceNumber: submission.value.InvoiceNumber,
      status: submission.value.status,
      Total: submission.value.Total,
      note: submission.value.note,
      user: {
        connect: { id: session.user?.id }, // Link the invoice to the authenticated user
      },
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Ansh Kumar",
  };

  await emailClient.send({
    from: sender,
    to: [{ email: "anshk4525@gmail.com" }], // submission.value.clientEmail
    template_uuid: "bc4880d0-8c88-49db-8f85-82e9caf0e438",
    template_variables: {
      clientName: submission.value.clientName,
      InvoiceNumber: submission.value.InvoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      TotalAmount: FormatCurrency(submission.value.Total),
      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`, // Consider a dynamic link here
    },
  });

  return redirect("/dashboard/invoices"); // Redirect to the invoices page after successful creation
}

export async function EditInvoices(prevState:any,formData:FormData):Promise<any>{
        const session = await requireUser()

          const submission = parseWithZod(formData, {
            schema: InvoiceSchema,
          });
        if(submission.status !== "success"){
          return submission.reply() 
        }
        const data = await prisma.invoice.update({
          where: {
            id: formData.get("id") as string,
            userId:session.user?.id
          },
          data:{
            clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceName: submission.value.invoiceName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      InvoiceNumber: submission.value.InvoiceNumber,
      status: submission.value.status,
      Total: submission.value.Total,
      note: submission.value.note,
       }
    });

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Ansh Kumar",
    };
    
    await emailClient.send({
      from: sender,
      to: [{ email: "anshk4525@gmail.com" }], // submission.value.clientEmail
      template_uuid: "feaa6721-d67f-4033-9a2c-a0b334485e88",
      template_variables: {
        clientName: submission.value.clientName,
        InvoiceNumber: submission.value.InvoiceNumber,
        dueDate: new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(submission.value.date)),
        TotalAmount: FormatCurrency(submission.value.Total),
        invoiceLink: `http://localhost:3000/api/invoice/${data.id}`, // Consider a dynamic link here
      },
    });



    return redirect("/dashboard/invoices")
}


export async function DeleteInvoices( invoiceId: string){
  const session = await requireUser()
  const data = await prisma.invoice.delete({
    where:{
      userId: session.user?.id,
      id:invoiceId
    }
  })
  
  return redirect("/dashboard/invoices")
}
export async function MarkasPaidaction( invoiceId: string){
  const session = await requireUser()
  const data = await prisma.invoice.update({
    where:{
      userId: session.user?.id,
      id: invoiceId,
    },
    data:{
      status:"PAID"
    }
    
  })
  
  return redirect("/dashboard/invoices")
}