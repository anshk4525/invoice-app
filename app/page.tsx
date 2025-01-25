import { HERO } from "./components/hero";
import { Navbar } from "./components/Navbar";


export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <Navbar/>
     <HERO/>
    </main>
    </div>
  );
}
