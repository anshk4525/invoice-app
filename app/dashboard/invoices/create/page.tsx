import { CreateInvoice } from "@/app/components/createinvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

async function getUserData(userId:string){
    const data = await prisma.user.findUnique({
      where:{
        id: userId,
      },
      select:{
        firstname:true,
        lastname:true,
        address:true,
        email:true,
      },
      
    })
    return data;
}
export default async function InvoiceCreationRoute(){
    const session = await requireUser();
    const data = await getUserData(session.user?.id as string);
    return(
        <div>
            <CreateInvoice
             lastName={data?.lastname as string}
             address={data?.address as  string} 
            email={data?.email as string}
             firstName={data?.firstname as string} />
        </div>
    )
}