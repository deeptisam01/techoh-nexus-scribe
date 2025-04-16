
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <ScrollArea className="flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </ScrollArea>
      <Toaster position="bottom-right" />
    </div>
  );
}
