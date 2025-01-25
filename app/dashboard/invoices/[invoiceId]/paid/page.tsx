import { MarkasPaidaction } from "@/app/actions";
import SubmitButton from "@/app/components/Submitbutton";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import paidgif  from "@/public/money-monkey.gif"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
async function Authorize( invoiceId: string, userId: string){
    const data = await prisma.invoice.findUnique({
        where:{
            id: invoiceId,
            userId: userId,
        }
    }
)
    if(!data){
       redirect("/dashboard/invoices")
    }
}

type Params = Promise<{invoiceId:string}>
export default async function MarkasPaid({params}:{params:Params}){
    const session = await requireUser();
    const{invoiceId} = await params
    await Authorize(
        invoiceId,
        session.user?.id as string,
 
    )
    return(
        <div className="flex flex-1 justify-center items-center">

            <Card className="max-w-[500px]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center"> Mark as Paid</CardTitle>
                    <CardDescription className="flex items-center justify-cente">
                        Are You Sure You Want To Mark The Invoice As Paid?
                    </CardDescription>
                </CardHeader>
                <CardContent >
                   <div className="flex justify-center items-center">
                   <Image
                    src={paidgif}
                    alt="paid"
                    className="rounded-lg "
                    />
                   </div>
                   
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                <Link  className={buttonVariants({variant:"outline"})} 
                    href="/dashboard/invoices"> Cancel</Link>
                    <form action={
                        async()=>{
                            "use server"
                            await MarkasPaidaction(invoiceId)
                        }
                    }>
                        <SubmitButton text="Mark as Paid!"/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}