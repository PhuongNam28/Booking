"use client";
import React, { useState } from "react";
import {
  Sidebar as ReactProSidebar,
  Menu,
  MenuItem,
  sidebarClasses,
} from "react-pro-sidebar";
import { MdOutlineDataUsage } from "react-icons/md";
import { FaBookOpen, FaHome, FaHotel, FaTrafficLight } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LucideLogOut } from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("/admin/dashboard");
  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
    { label: "Trips", icon: <BiSolidCategory />, link: "/admin/trips" },
    { label: "Hotels", icon: <FaHotel />, link: "/admin/hotel" },
    { label: "Flight", icon: <FaTrafficLight />, link: "/admin/flight" },
    {
      label: "HoTel Bookings",
      icon: <FaBookOpen />,
      link: "/admin/my-booking",
    },
    {
      label: "Trip Bookings",
      icon: <FaBookOpen />,
      link: "/admin/my-booking-trip",
    },

    {
      label: "Flight Bookings",
      icon: <FaBookOpen />,
      link: "/admin/my-book-flight",
    },
    // Add more menu items as needed
  ];

  const handleLogout = () => {
    // Redirect to login page when logout is clicked
    router.push("/admin/login");
  };

  return (
    <div className="h-screen overflow-hidden">
      <ReactProSidebar
        className="h-full overflow-hidden"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Menu
          className="h-full max-h-full text-black overflow-hidden"
          menuItemStyles={{
            button: ({ level, active }) => {
              return {
                backgroundColor: active ? "#0E1428" : "#ffffff",
                color: active ? "#ffffff" : "#000000",
              };
            },
          }}
        >
          <div className="flex m-10 my-10 flex-col">
            <div
              onClick={() => router.push("/admin/dashboard")}
              className="cursor-pointer"
            >
              <Image src="/logo.png" height={100} width={100} alt="logo" />
              <span className="text-xl uppercase font-medium italic text-black">
                Palm Tree
              </span>
            </div>
          </div>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              onClick={() => router.push(item.link)}
            >
              {item.label}
            </MenuItem>
          ))}
          <MenuItem icon={<LucideLogOut />} onClick={handleLogout}>
            LogOut
          </MenuItem>
        </Menu>
      </ReactProSidebar>
    </div>
  );
};

export default Sidebar;
