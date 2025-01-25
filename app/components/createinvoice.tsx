"use client";
import { useActionState, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarSearchIcon } from "lucide-react";
import SubmitButton from "./Submitbutton";
import { parseWithZod } from "@conform-to/zod";
import { InvoiceSchema } from "../utils/zodschema";
import { CreateInvoices } from "../actions";
import { currencies } from "../utils/currencies";
import { useForm } from '@conform-to/react';

interface iAppProps{
  firstName: string,
  lastName: string,
  address: string,
  email: string,
}

// Format currency correctly
export function FormatCurrency(amount: number, selectedCurrency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: selectedCurrency,
  }).format(amount);
}

export function CreateInvoice({address,firstName,lastName,email}:iAppProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");

  const [lastResult, action] = useActionState(CreateInvoices, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: InvoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // Calculate total amount
  const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name={fields.date.name} value={selectedDate.toISOString()} />
          <input type="hidden" name={fields.Total.name} value={calculateTotal} />

          {/* Invoice Name */}
          <div className="flex flex-col mb-6 gap-2">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="Enter description"
              />
            </div>
            <p className="text-red-500 text-sm">{fields.invoiceName.errors}</p>
          </div>

          {/* Invoice Number and Currency Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="invoiceNumber">Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted text-sm text-muted-foreground flex items-center">#</span>
                <Input
                  id="invoiceNumber"
                  placeholder="5"
                  className="rounded-l-none"
                  name={fields.InvoiceNumber.name}
                  key={fields.InvoiceNumber.key}
                  defaultValue={fields.InvoiceNumber.initialValue}
                />
              </div>
              <p className="text-red-500 text-sm">{fields.InvoiceNumber.errors}</p>
            </div>

            {/* Currency Selector */}
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                value={selectedCurrency}
                onValueChange={(value) => setSelectedCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency">
                    {currencies.find((c) => c.code === selectedCurrency)?.name || "USD"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sender and Recipient Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input name={fields.fromName.name} key={fields.fromName.key} placeholder="Your Name"
                defaultValue={firstName+" "+lastName} />
                <p className="text-red-500 text-sm">{fields.fromName.errors}</p>
                <Input name={fields.fromEmail.name} key={fields.fromEmail.key} placeholder="Your Email"
                defaultValue={email} />
                <p className="text-red-500 text-sm">{fields.fromEmail.errors}</p>
                <Input name={fields.fromAddress.name} key={fields.fromAddress.key} placeholder="Your Address" 
                defaultValue={address}/>
                <p className="text-red-500 text-sm">{fields.fromAddress.errors}</p>
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Input name={fields.clientName.name} key={fields.clientName.key} placeholder="Client Name" />
                <p className="text-red-500 text-sm">{fields.clientName.errors}</p>
                <Input name={fields.clientEmail.name} key={fields.clientEmail.key} placeholder="Client Email" />
                <p className="text-red-500 text-sm">{fields.clientEmail.errors}</p>
                <Input name={fields.clientAddress.name} key={fields.clientAddress.key} placeholder="Client Address" />
                <p className="text-red-500 text-sm">{fields.clientAddress.errors}</p>
              </div>
            </div>
          </div>

          {/* Date and Invoice Due */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarSearchIcon />
                    {selectedDate ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(selectedDate) : <span>Pick a Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar fromDate={new Date()} mode="single" selected={selectedDate} onSelect={(date) => setSelectedDate(date || new Date())} />
                </PopoverContent>
              </Popover>
              <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>
            <div>
              <Label>Invoice Due</Label>
              <Select name={fields.dueDate.name} key={fields.dueDate.key} defaultValue={fields.dueDate.initialValue}>
                <SelectTrigger id="invoiceDue">
                  <SelectValue placeholder="Select Due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due On Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
                <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
              </Select>
            </div>
          </div>

          {/* Items and Totals */}
          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  placeholder="Items Name & Description"
                />
                <p className="text-red-500 text-sm">{fields.invoiceItemDescription.errors}</p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <p className="text-red-500 text-sm">{fields.invoiceItemQuantity.errors}</p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <p className="text-red-500 text-sm">{fields.invoiceItemRate.errors}</p>
              </div>
              <div className="col-span-2">
                <Input disabled value={FormatCurrency(calculateTotal, selectedCurrency)} />
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{FormatCurrency(calculateTotal, selectedCurrency)}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({selectedCurrency})</span>
                <span className="font-medium underline underline-offset-2">{FormatCurrency(calculateTotal, selectedCurrency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder="Add Your Note"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end mt-6">
            <SubmitButton text="Send Invoice To Client" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
