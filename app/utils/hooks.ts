import { redirect } from "next/navigation";
import { auth } from "./auth"; // Ensure this import points to the correct location

export async function requireUser() {
  const session = await auth(); // Retrieve the current user session (from cookies or database)
  
  if (!session) {
    redirect("/login");
  } else {
    return session
  }
}

