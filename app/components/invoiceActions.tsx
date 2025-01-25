"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DownloadCloudIcon, Mail, MoreHorizontal, PencilIcon, SquareCheckBigIcon, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface iAppProps{
  id:string;
  status:string;

}
export function InvoiceActions({id,status}: iAppProps) {
const HandlesendReminder=()=>{
    toast.promise(fetch(`/api/email/${id}`,{method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },
     
    }),{
      loading: "Sending Reminder Email",
      success: "Email sent successfully",
      error: "Failed to send email",
    }
  );
}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  size="icon" variant="secondary">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${id}`}>
            <PencilIcon className="size-4 mr-2"/>
            Edit 
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={`/api/invoice/${id}`}target="_blank">
            <DownloadCloudIcon className="size-4 mr-2"/>
            Download 
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem  onClick={HandlesendReminder}>
            
            <Mail className="size-4 mr-2"/>
            Remminder Email
            
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${id}/delete`}>
            <Trash className="size-4 mr-2"/>
            Delete
            </Link>
        </DropdownMenuItem>
         {status!== "PAID"&& ( <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${id}/paid`}>
            <SquareCheckBigIcon className="size-4 mr-2"/>
              Mark as Paid
            </Link>
        </DropdownMenuItem>)}
      </DropdownMenuContent> 
    </DropdownMenu>
  );
}
