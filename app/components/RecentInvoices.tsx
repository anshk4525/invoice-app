import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      Total: true,
      clientEmail: true,
    },
    orderBy: {
      created: "desc",
    },
    take: 8,
  });
  return data;
}

export async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="bg-gray-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {data.length > 0 ? (
          data.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center gap-4 border-b pb-4 last:border-none flex-col sm:flex-row"
            >
              <Avatar className="hidden sm:flex w-9 h-9 bg-blue-100 text-blue-600">
                <AvatarFallback className="text-sm font-semibold">
                  {invoice.clientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm font-medium text-gray-900 leading-none sm:mr-4">
                  {invoice.clientName}
                </p>
                <p className="text-sm text-gray-500 sm:text-left">{invoice.clientEmail}</p>
              </div>
              <div className="ml-auto text-sm font-medium text-green-600 mt-2 sm:mt-0">
                +${invoice.Total.toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recent invoices found.</p>
        )}
      </CardContent>
    </Card>
  );
}
