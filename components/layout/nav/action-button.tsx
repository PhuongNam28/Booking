import { ModeToggle } from "@/components/theme-toogle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton, useAuth } from "@clerk/nextjs";

import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ActionButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col space-y-4 items-start w-full text-lg text black mt-10">
                  <Link href="/">Get started</Link>
                  <Button
                    onClick={() => router.push("/sign-in")}
                    variant="outline"
                    size="sm"
                  >
                    Sign in
                  </Button>
                  <Button onClick={() => router.push("/sign-up")} size="sm">
                    Sign up{" "}
                  </Button>
                  <Link href="/">Hotels</Link>
                  <Link href="/">Flights</Link>
                  <Link href="/">Trips</Link>
                  <Link href="/">Contact</Link>
                  <Link href="/">About</Link>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex md:space-x-4">
        <div>
          <ModeToggle />
        </div>
        <UserButton afterSignOutUrl="/" />
        {!userId && (
          <>
            <Button
              onClick={() => router.push("/sign-in")}
              variant="outline"
              size="sm"
            >
              Sign in
            </Button>

            <Button onClick={() => router.push("/sign-up")} size="sm">
              Sign up{" "}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActionButton;
