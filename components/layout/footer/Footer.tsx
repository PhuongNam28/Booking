"use client";
import Container from "@/components/Container";
import FooterList from "./FooterList";
import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/admin/dashboard";
  const isLoginPage = pathname === "/admin/login";
  const isTripsPage = pathname === "/admin/trips";
  const isHotelsPage = pathname === "/admin/hotel";
  const isBookingsPage = pathname === "/admin/booking";

  // Nếu đang ở trang admin/dashboard, không hiển thị NavBar
  if (
    isLoginPage ||
    isDashboardPage ||
    isBookingsPage ||
    isTripsPage ||
    isHotelsPage
  ) {
    return null;
  }
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Hotel Categories</h3>

            <Link href="#">Resort</Link>
            <Link href="#">Room</Link>
            <Link href="#">Tour</Link>
          </FooterList>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Customer Service</h3>

            <Link href="#">Contact us</Link>
            <Link href="#">Refund & Policy</Link>
            <Link href="#">Watches</Link>
            <Link href="#">FAQs</Link>
          </FooterList>

          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">About us</h3>
            <p className="mb-2">
              Welcome to Resort Hotel, your ultimate destination for relaxation
              and luxury. Nestled in breathtaking surroundings, our hotel offers
              a perfect retreat for travelers seeking tranquility and comfort.
            </p>
            <p>
              &copy; {new Date().getFullYear()} PalmTree. All rights reserved
            </p>
          </div>

          <FooterList>
            <h3 className="text-base font-bold mb-2">Follow us</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>

              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>

              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>

              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
