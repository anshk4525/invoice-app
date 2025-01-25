import prisma from "@/app/utils/db"
import { requireUser } from "@/app/utils/hooks"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WarningProvider } from "@radix-ui/react-dialog"
import { MessageCircleWarning } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import Warninggif  from "@/public/be-doo-be-doo-minion.gif"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import SubmitButton from "@/app/components/Submitbutton"
import { DeleteInvoices } from "@/app/actions"

async function Authorize( invoiceId: string, userId: string){
    const data = await prisma.invoice.findUnique({
        where:{
            id: invoiceId,
            userId: userId,
        },
    })
    if(!data){
        return redirect("/dashboard/invoices")
    }
}
type Params= Promise<{invoiceId:string}>
export default async function DeleteInvoiceRoute({params}: {params:Params}){
    const session = await requireUser();
   const {invoiceId} = await params
    await Authorize(invoiceId, session.user?.id as string)

    ;
return(
    <div className="flex flex-1 justify-center items-center">
        <Card className="max-w-[500px]">
            <CardHeader>
                <CardTitle> Delete Invoice</CardTitle>
                <CardDescription>
                    Are You Sure You Want 
                    To Delete The Invoice?
                </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
              className="rounded-lg"
              src={Warninggif}
              alt="warning"
              />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Link href="/dashboard/invoices" className={buttonVariants({variant:"secondary"})}>
                Cancel</Link>
                <form action={async ()=>{
                    "use server"
                    await DeleteInvoices(invoiceId);
                }}>
                    <SubmitButton variant={"destructive"}
                    text="Delete Invoice" />
                </form>
            </CardFooter>
        </Card>

    </div>
)
}