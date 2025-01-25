import { z } from "zod";

export const OnboardingSchema = z.object({
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  address: z.string().min(2, "Address is required"),
});

export const InvoiceSchema = z.object({
  invoiceName: z.string().min(2, "Invoice Name is required"),
  Total: z.number().nonnegative("Total Amount must be non-negative"), // Ensure Total is >= 0
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date must be a valid ISO string",
  }), // Validate as a valid ISO date string
  dueDate: z.number().min(0, "Due Date must be at least 0"), // Allow dueDate to be 0
  fromName: z.string().min(2, "From Name is required"),
  fromEmail: z.string().email("Invalid email"),
  fromAddress: z.string().min(2, "From Address is required"),
  clientName: z.string().min(2, "Client Name is required"),
  clientEmail: z.string().email("Invalid email"),
  clientAddress: z.string().min(2, "Client Address is required"),
  currency: z.string().min(2, "Currency is required"),
  InvoiceNumber: z.number().positive("Invoice Number must be greater than 0"), // Ensure it's > 0
  note: z.string().optional(),
  invoiceItemDescription: z.string().min(2, "Invoice Item Description is required"),
  invoiceItemQuantity: z.number().min(1, "Invoice Item Quantity must be at least 1"),
  invoiceItemRate: z.number().min(1, "Invoice Item Rate must be at least 1"),
});
