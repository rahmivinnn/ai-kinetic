import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-[#01042A] to-[#004586] text-white">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center" prefetch={false}>
            <img
              src="/kinetic-logo.png"
              alt="Kinetic AI"
              className="h-10 p-[2px] rounded-md"
            />
            <span className="ml-2 font-semibold text-lg hidden sm:inline-block">Kinetic AI</span>
          </Link>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    href="#features"
                    className="font-medium text-base py-2 hover:text-primary"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="font-medium text-base py-2 hover:text-primary"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="#success-stories"
                    className="font-medium text-base py-2 hover:text-primary"
                  >
                    Success Stories
                  </Link>
                  <Link
                    href="#resources"
                    className="font-medium text-base py-2 hover:text-primary"
                  >
                    Resources
                  </Link>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button asChild variant="outline">
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">Sign up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-4">
            <Link
              href="#features"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              How It Works
            </Link>
            <Link
              href="#success-stories"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Success Stories
            </Link>
            <Link
              href="#resources"
              className="font-medium flex items-center text-sm transition-colors hover:underline"
              prefetch={false}
            >
              Resources
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
