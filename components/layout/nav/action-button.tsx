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
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
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
                  <Link href="/">Get started</Link>
                  <Link href="/hotel-list">Hotels</Link>
                  <Link href="/flight-list">Flights</Link>
                  <Link href="/trip-list">Trips</Link>
                  <Link href="/chat">Chat</Link>
                  <Link href="/my-booking">My-booking Hotels</Link>
                  <Link href="/my-bookings-flight">My-booking Flights</Link>
                  <Link href="/my-bookings-trip">My-booking Trips</Link>
                  <Link href="/">Contact</Link>
                  <Link href="/">About</Link>
                  <Link href="/" onClick={handleLogout}>
                    Log Out
                  </Link>
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
