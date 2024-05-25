"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeIcon } from "lucide-react";

export function Action() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <HomeIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            router.push("/my-booking");
          }}
        >
          My-Booking Hotel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/my-bookings-trip");
          }}
        >
          My-Booking Trip
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/my-bookings-flight");
          }}
        >
          My-Booking Flight
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/admin");
          }}
        >
          Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
