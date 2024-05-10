"use client";

import { usePathname, useRouter } from "next/navigation";
import { TripWithRooms } from "./AddTripForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Train, Waves } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";
import { formatTime } from "@/lib/utils";
import { format } from "date-fns";

const TripCard = ({ trip }: { trip: TripWithRooms }) => {
  const pathname = usePathname();
  const isMyTrips = pathname.includes("my-trips");
  const router = useRouter();
  // Định dạng thời gian departureTime
  const formattedDepartureTime = format(
    new Date(trip.departureTime),
    "dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(new Date(trip.arrivalTime), "dd/MM/yyyy");

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(trip.country);
  return (
    <div
      onClick={() => !isMyTrips && router.push(`/trip-details/${trip.id}`)}
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyTrips && "cursor-default"
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={trip.image}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-x1">{trip.title}</h3>
          <div className="text-primary/90">
            {trip.description.substring(0, 45)}...
          </div>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="w-4 h-4" />
              {country?.name},{trip.city}
            </AmenityItem>
          </div>
          <div className="flex items-center gap-1">
            {/* Thêm thông tin departureTime */}
            <div className="text-xs"> {formattedDepartureTime}</div>
            {/* Thêm thông tin arrivalTime */} -
            <div className="text-xs">{formattedArrivalTime}</div>
            {/* Thêm thông tin duration */}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {trip?.roomtrips[0]?.roomPrice && (
                <>
                  <div className="font-semibold text-base">
                    ${trip?.roomtrips[0].roomPrice}
                  </div>
                  <div className="text-xs">/ person</div>
                </>
              )}
            </div>

            {isMyTrips && (
              <Button
                onClick={() => router.push(`/trip${trip.id}`)}
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

export default TripCard;
