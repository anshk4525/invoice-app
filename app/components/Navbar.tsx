import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="w-full py-5 px-6 fixed top-0 left-0 bg-white z-10 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo on the left */}
        <Link href="/login">
          <h1 className="text-3xl font-semibold text-gray-800 font-poppins">
            INVOICELY
          </h1>
        </Link>
        
        {/* Get Started button on the top right */}
        <Link href="/login">
          <Button className="ml-auto">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
