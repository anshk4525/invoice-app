import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { FormatCurrency } from "../utils/formatcurrency";

async function fetchData(userId: string) {
  try {
    const [data, openInvoices, paidInvoices] = await Promise.all([
      prisma.invoice.findMany({
        where: { userId },
        select: { Total: true },
      }),
      prisma.invoice.findMany({
        where: { userId, status: "PENDING" },
        select: { id: true },
      }),
      prisma.invoice.findMany({
        where: { userId, status: "PAID" },
        select: { id: true },
      }),
    ]);

    return {
      totalRevenue: data.reduce((acc, invoice) => acc + (invoice.Total || 0), 0),
      openInvoicesCount: openInvoices.length,
      paidInvoicesCount: paidInvoices.length,
      totalInvoicesIssued: data.length,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      totalRevenue: 0,
      openInvoicesCount: 0,
      paidInvoicesCount: 0,
      totalInvoicesIssued: 0,
    };
  }
}

export async function DashboardBlocks() {
  const session = await requireUser(); // Get user session
  const userId = session.user?.id as string;

  const {
    totalRevenue,
    openInvoicesCount,
    paidInvoicesCount,
    totalInvoicesIssued,
  } = await fetchData(userId);

  // Assuming selectedCurrency is either a state or context value that you can pass here
  const selectedCurrency = "USD"; // Replace this with the actual currency selection logic

  const blocks = [
    {
      title: "Total Revenue",
      value: FormatCurrency(totalRevenue, selectedCurrency),
      description: "Based on Total Volume",
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Total Invoices Issued",
      value: totalInvoicesIssued,
      description: "Total Invoices Issued",
      icon: <Users className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Paid Invoices",
      value: paidInvoicesCount,
      description: "Total Invoices Paid",
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Pending Invoices",
      value: openInvoicesCount,
      description: "Invoices Which are Currently Pending!",
      icon: <Activity className="w-6 h-6 text-red-500" />,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {blocks.map((block, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow rounded-lg border bg-white p-4"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-medium text-gray-700">
              {block.title}
            </CardTitle>
            {block.icon}
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-bold text-gray-900">{block.value}</h3>
            <p className="text-sm text-gray-500">{block.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
