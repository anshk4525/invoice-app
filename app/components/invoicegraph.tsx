import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Graph } from "./graph";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";

async function getInvoices(userId: string) {
  const rawdata = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      created: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      created: true,
      Total: true,
    },
    orderBy: {
      created: "asc",
    },
  });

  // Group and aggregate data by date
  const aggregateData = rawdata.reduce((acc: { [key: string]: number }, curr) => {
    const date = new Date(curr.created).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + curr.Total;
    return acc;
  }, {});

  const transformedData = Object.entries(aggregateData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(`${date}, ${new Date().getFullYear()}`),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({ date, amount }));

  return transformedData;
}

export async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);

  return (
    <Card className="lg:col-span-2 border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Paid Invoices
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          A visual representation of your paid invoices over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {data.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-4">
              Below is the chart showing the total amounts of paid invoices for each day in the last 30 days.
            </div>
            <Graph data={data} />
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>No paid invoices found for the last 30 days.</p>
            <p className="mt-2">Make sure you have paid invoices in this timeframe.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
