import React, { ReactNode } from 'react';
import { requireUser } from '../utils/hooks';
import Link from 'next/link';
import Dashboardlinks from '../components/Dashboardlinks';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Users2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { signOut } from '../utils/auth';
import prisma from '../utils/db';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
async function getUser( UserId: string){
  const data = await prisma.user.findUnique({
    where:{
      id: UserId,
    },
    select:{
      firstname:true,
      lastname:true,
      address:true,
    },
  });
  if(!data?.firstname|| !data.address||!data.lastname){
    redirect("/onboarding")
  }
}

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireUser();
  const data = await getUser(session.user?.id as string);

  return (
    <>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex flex-col max-h-screen h-full gap-2">
          {/* Logo Section */}
          <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center">
              <p className="text-lg font-bold tracking-wide text-blue-600">Invoicely</p>
            </Link>
          </div>
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Dashboardlinks />
            </nav>
          </div>
        </div>
      </div>
    
      <div className="flex flex-col">
        <header
          className="flex h-14 items-center gap-4 bg-muted border-b px-4 lg:h-[60px] lg:px-6"
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open Navigation Menu">
                <Menu className="size-5" />
              </Button >
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle>
                <span className="sr-only">Navigation Menu</span>
              </SheetTitle>
              <nav className="grid gap-2 mt-10">
                <Dashboardlinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button  variant="outline" size="icon" asChild className='rounded-full'>
                  <Users2 />
                </Button>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel> My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"> dashboard</Link>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/invoices">Invoices</Link>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator/>
                   <DropdownMenuItem asChild>
                    <form className='w-full' action={async () =>{
                      "use server";
                      await signOut();
                    }}>
                      <button className='w-full text-left'> Log Out</button>
                    </form>
                   </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
    <Toaster richColors closeButton theme='light'> 
                 
    </Toaster>
   </>
  );
};

export default DashboardLayout;
