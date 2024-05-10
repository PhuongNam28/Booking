"use client";

import { BookingFlight } from "@prisma/client";
import { FlightWithRooms } from "./AddFlightForm";
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  Car,
  Clapperboard,
  Dumbbell,
  MapPin,
  ShoppingBasket,
  Utensils,
  Wine,
} from "lucide-react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import RoomTypeCard from "../type/RoomTypeCard";
import { format } from "date-fns";

const FlightDetailsClient = ({
  flight,
  bookings,
}: {
  flight: FlightWithRooms;
  bookings?: BookingFlight[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const fromCountry = getCountryByCode(flight.fromCountry);
  const toCountry = getCountryByCode(flight.toCountry);
  const formattedDepartureTime = format(
    new Date(flight.departureTime),
    "dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(
    new Date(flight.arrivalTime),
    "dd/MM/yyyy"
  );
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[800px] md:h-[200px] rounded-lg">
        <Image
          fill
          src={flight.image}
          alt={flight.name}
          className="object-cover"
        />
      </div>
      <div>
        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-xl md:text-3xl">{flight.name}</h3>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <div>From</div>
              <MapPin className="h-4 w-4" />
              {fromCountry?.name}
            </AmenityItem>
            <AmenityItem>
              <div>To</div>
              <MapPin className="h-4 w-4" />
              {toCountry?.name}
            </AmenityItem>
          </div>
        </div>

        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">Duration</h3>
          <p className="text-primary/90 mb-2 leading-[1.5]">
            {formattedDepartureTime} - {formattedArrivalTime} in{" "}
            {flight.duration} hours
          </p>
        </div>

        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">About this flight</h3>
          <p className="text-primary/90 mb-2">{flight.description}</p>
        </div>

        {!!flight.types.length && (
          <div className=" p-4 rounded-lg">
            <h3 className="text-lg font-semibold my-4">Type Flight</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {flight.types.map((type) => (
                <RoomTypeCard
                  flight={flight}
                  type={type}
                  key={type.id}
                  bookingflight={bookings}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetailsClient;
