"use client";

import { usePathname, useRouter } from "next/navigation";
import ActionButton from "./action-button";
import Logo from "./logo";
import NavigationBar from "./navigation-bar";

const NavbarTest = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/admin/dashboard";
  const isLoginPage = pathname === "/admin/login";
  const isTripsPage = pathname === "/admin/trips";
  const isHotelsPage = pathname === "/admin/hotel";
  const isBookingsPage = pathname === "/admin/booking";
  const isAddHotelPage = pathname === "/hotel/new";
  const isAddTripPage = pathname === "/trip/new";

  // Kiểm tra nếu đang ở các trang mà NavbarTest không cần hiển thị
  if (
    isDashboardPage ||
    isLoginPage ||
    isBookingsPage ||
    isTripsPage ||
    isHotelsPage ||
    isAddHotelPage ||
    isAddTripPage
  ) {
    return null;
  }

  // Nếu không, hiển thị NavbarTest
  return (
    <div className="flex justify-between items-center px-10 border-b">
      <Logo />
      <NavigationBar />
      <ActionButton />
    </div>
  );
};

export default NavbarTest;
