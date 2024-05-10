"use client";

import { BookingTrip } from "@prisma/client";
import { TripWithRooms } from "./AddTripForm";
import useLocation from "@/hooks/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  Car,
  Clapperboard,
  Dumbbell,
  MapPin,
  Settings,
  ShoppingBasket,
  Train,
  Utensils,
  Wine,
} from "lucide-react";
import { FaSpa, FaSwimmer } from "react-icons/fa";
import { MdDryCleaning } from "react-icons/md";
import RoomTripCard from "../roomtrip/RoomTripCard";
import parse from "html-react-parser";
import { format } from "date-fns";

const TripDetailsClient = ({
  trip,
  bookingtrip,
}: {
  trip: TripWithRooms;
  bookingtrip?: BookingTrip[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(trip.country);
  const state = getStateByCode(trip.country, trip.state);
  // Định dạng thời gian departureTime
  const formattedDepartureTime = format(
    new Date(trip.departureTime),
    "HH:mm-dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(
    new Date(trip.arrivalTime),
    "HH:mm-dd/MM/yyyy"
  );

  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[400px] md:h-[200px] rounded-lg">
        <Image
          fill
          src={trip.image}
          alt={trip.title}
          className="object-cover"
        />
      </div>
      <div>
        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-xl md:text-3xl">{trip.title}</h3>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name}, {state?.name}, {trip.city}
            </AmenityItem>
          </div>
        </div>

        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">Duration</h3>
          <p className="text-primary/90 mb-2 leading-[1.5]">
            {formattedDepartureTime} - {formattedArrivalTime} in {trip.duration}{" "}
            days
          </p>
        </div>

        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
          <p className="text-primary/90 mb-2 leading-[1.5]">
            {trip.locationDescription}
          </p>
        </div>

        <div className="p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">About this trip</h3>
          <p className="text-primary/90 mb-2">
            {" "}
            {parse(trip.destinationDetails)}
          </p>
        </div>

        <div className=" p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
            {trip.tourGuide && (
              <AmenityItem>
                <MapPin size={18} />
                Tour Guide
              </AmenityItem>
            )}

            {trip.transportation && (
              <AmenityItem>
                <Train size={18} />
                Transportation
              </AmenityItem>
            )}

            {trip.supportService && (
              <AmenityItem>
                <Settings size={18} />
                Support Service
              </AmenityItem>
            )}

            {trip.activities && (
              <AmenityItem>
                <FaSwimmer size={18} />
                Activities
              </AmenityItem>
            )}
          </div>
        </div>

        {!!trip.roomtrips.length && (
          <div className=" p-4 rounded-lg">
            <h3 className="text-lg font-semibold my-4">Trip Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {trip.roomtrips.map((roomtrips) => (
                <RoomTripCard
                  trip={trip}
                  roomtrip={roomtrips}
                  key={roomtrips.id}
                  bookingtrips={bookingtrip}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailsClient;
