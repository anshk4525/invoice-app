import { Button } from "@/components/ui/button";
import { requireUser } from "../utils/hooks"
import { signOut } from "../utils/auth";
import { DashboardBlocks } from "../components/DashboardBlocks";
import { InvoiceGraph } from "../components/invoicegraph";
import { RecentInvoices } from "../components/RecentInvoices";


export default async function DashboardRoute(){
  const session = await requireUser()
 return (
   <>
   <DashboardBlocks/>

   <div className="grid gap-4 lg:grid-cols-3 md:gap-8"> 
         <InvoiceGraph/>
         <h1 className="col-span-1"> <RecentInvoices/></h1>
   </div>
   </>

   
 )

}