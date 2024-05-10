"use client";

import { usePathname, useRouter } from "next/navigation";
import { FlightWithRooms } from "./AddFlightForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";
import { format } from "date-fns";

const FlightCard = ({ flight }: { flight: FlightWithRooms }) => {
  const pathname = usePathname();
  const isMyFlights = pathname.includes("my-flights");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const fromcountry = getCountryByCode(flight.fromCountry);

  const tocountry = getCountryByCode(flight.toCountry);
  const formattedDepartureTime = format(
    new Date(flight.departureTime),
    "HH:mm-dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(
    new Date(flight.arrivalTime),
    "HH:mm-dd/MM/yyyy"
  );
  return (
    <div
      onClick={() =>
        !isMyFlights && router.push(`/flight-details/${flight.id}`)
      }
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyFlights && "cursor-default"
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={flight.image}
            alt={flight.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-x1">{flight.name}</h3>
          <div className="text-primary/90">
            {flight.description.substring(0, 45)}...
          </div>
          <div className="text-primary/90">
            <AmenityItem>
              <div>From</div>
              <MapPin className="h-4 w-4" />
              {fromcountry?.name}
            </AmenityItem>
            <AmenityItem>
              <div>To</div>
              <MapPin className="h-4 w-4" />
              {tocountry?.name}
            </AmenityItem>
            <div className="flex items-center gap-1 mt-4">
              {/* Thêm thông tin departureTime */}
              <div className="text-xs"> {formattedDepartureTime}</div>
              {/* Thêm thông tin arrivalTime */} -
              <div className="text-xs">{formattedArrivalTime}</div>
              {/* Thêm thông tin duration */}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {flight?.types[0]?.roomPrice && (
                <>
                  <div className="font-semibold text-base">
                    ${flight?.types[0].roomPrice}
                  </div>
                  <div className="text-xs">/ person</div>
                </>
              )}
            </div>
            {isMyFlights && (
              <Button
                onClick={() => router.push(`/flight${flight.id}`)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
