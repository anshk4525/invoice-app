import InvoiceList from '@/app/components/invoiceList'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const InvoicesRoute = () => {
  return (
    <Card className="w-full max-w-screen-lg mx-auto p-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold sm:text-3xl">Invoices</CardTitle>
            <CardDescription className="text-sm sm:text-base">Manage your invoices right here</CardDescription>
          </div>
          <Link
            href="/dashboard/invoices/create"
            className={`${buttonVariants()} mt-4 sm:mt-0`}
          >
            <PlusIcon className="mr-2" /> Create Invoice
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceList />
      </CardContent>
    </Card>
  )
}

export default InvoicesRoute
