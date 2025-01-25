// "use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceActions } from './invoiceActions';
import prisma from '../utils/db';
import { requireUser } from '../utils/hooks';
import { FormatCurrency } from '../utils/formatcurrency';
import { Badge } from '@/components/ui/badge';

async function Getdata(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      Total: true,
      status: true,
      created: true,
      InvoiceNumber: true,
    },
    orderBy: {
      created: 'desc',
    },
    take: 10,
  });
  return data;
}

export default async function InvoiceList() {
  const session = await requireUser();
  const data = await Getdata(session.user?.id as string);

  return (
    <div>
      <><Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">#{invoice.InvoiceNumber}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{FormatCurrency(invoice.Total)}</TableCell>
              <TableCell><Badge>{invoice.status}</Badge></TableCell>
              <TableCell>{new Date(invoice.created).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <InvoiceActions id={invoice.id} status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></>
    </div>
  );
}
