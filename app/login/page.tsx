import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../utils/auth";
import { Button } from "@/components/ui/button";
import SubmitButton from "../components/Submitbutton";
import { redirect } from "next/navigation";
require("dotenv").config();

export default async function Login() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-full max-w-md p-6 shadow-2xl rounded-lg bg-white opacity-90 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-center text-gray-800">Login</CardTitle>
            <CardDescription className="text-center text-sm text-gray-500 mt-2">
              Enter Your Email Below To Login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              action={async (formData) => {
                "use server";
                await signIn("nodemailer", formData);
              }} 
              className="flex flex-col gap-y-6"
            >
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <input 
                  name="email"
                  type="email"
                  placeholder="Johndoe@gmail.com"
                  required
                  className="w-full mt-1 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
              <SubmitButton 
                variant={"outline"}
                text="Submit"
                
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
