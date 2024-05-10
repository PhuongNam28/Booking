"use client";
import { BookingTrip, Trip, RoomTrip } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bed,
  BedDouble,
  Castle,
  Home,
  MapPin,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  User,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

import { useToast } from "../ui/use-toast";

import { differenceInCalendarDays } from "date-fns";

import { useAuth } from "@clerk/nextjs";
import useBookTrip from "@/hooks/useBookTrip";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
import { Button } from "../ui/button";
import { format } from "date-fns";
interface MyBookingTripClientProps {
  bookingtrip: BookingTrip & { RoomTrip: RoomTrip | null } & {
    Trip: Trip | null;
  };
}

const MyBookingsTripClient: React.FC<MyBookingTripClientProps> = ({
  bookingtrip,
}) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookTrip();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIstLoading, setBookingIsLoading] = useState(false);

  const [member, setMember] = useState<number>(0);

  const [availableSeats, setAvailableSeats] = useState(
    bookingtrip.availableSeats
  );

  const { getCountryByCode, getStateByCode } = useLocation();

  const { userId } = useAuth();

  const { toast } = useToast();

  const router = useRouter();

  const { Trip, RoomTrip } = bookingtrip;

  if (!Trip || !RoomTrip) return <div>Missing Data...</div>;

  const country = getCountryByCode(Trip.country);

  const state = getStateByCode(Trip.country, Trip.state);

  const formattedDepartureTime = format(
    new Date(Trip.departureTime),
    "dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(new Date(Trip.arrivalTime), "dd/MM/yyyy");

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!Trip?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (member > bookingtrip.availableSeats) {
      return toast({
        variant: "destructive",
        description: "Not available Seats!",
      });
    }

    setBookingIsLoading(true);

    const bookingRoomData = {
      roomtrip: RoomTrip,
      totalPrice: bookingtrip.totalPrice,
      breakFastIncluded: bookingtrip.breakFastIncluded,
      member: member,
      availableSeats: availableSeats,
    };
    setRoomData(bookingRoomData);

    fetch("/api/create-payment-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          tripOwnerId: Trip.userId,
          tripId: Trip.id,
          roomtripId: RoomTrip.id,
          breakFastIncluded: bookingRoomData.breakFastIncluded,
          totalPrice: bookingRoomData.totalPrice,
        },
        payment_intent_id: paymentIntentId,
      }),
    })
      .then((res) => {
        setBookingIsLoading(false);
        if (res.status === 401) {
          return router.push("/login");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        setPaymentIntentId(data.paymentIntent.id);
        router.push("/book-room-trip");
      })
      .catch((error: any) => {
        console.log("Error:", error);
        toast({
          variant: "destructive",
          description: `ERROR ! ${error.message}`,
        });
        setIsLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Trip.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name},{state?.name},{Trip.city}
            </AmenityItem>
          </div>
          <p className="pb-2">{Trip.locationDescription}</p>
        </CardDescription>
        <CardTitle>{RoomTrip.title}</CardTitle>
        <CardDescription>{RoomTrip.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={RoomTrip.image}
            alt={RoomTrip.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              {
                icon: <Bed className="h-4 w-4" />,
                text: `${RoomTrip.bedCount} Bed(s)`,
              },
              {
                icon: <User className="h-4 w-4" />,
                text: `${RoomTrip.guestCount} Guest(s)`,
              },
              !!RoomTrip.kingBed && {
                icon: <BedDouble className="h-4 w-4" />,
                text: `${RoomTrip.kingBed} King Bed(s)`,
              },
              !RoomTrip.queenBed && {
                icon: <Bed className="h-4 w-4" />,
                text: `${RoomTrip.queenBed} Queen Bed(s)`,
              },
              RoomTrip.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              RoomTrip.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${RoomTrip.TV} TV`,
              },
              RoomTrip.balcony && {
                icon: <Home className="h-4 w-4" />,
                text: `${RoomTrip.balcony} Balcony`,
              },
              RoomTrip.freeWifi && {
                icon: <Wifi className="h-4 w-4" />,
                text: "Free Wifi",
              },
              RoomTrip.cityView && {
                icon: <Castle className="h-4 w-4" />,
                text: `${RoomTrip.cityView} City View`,
              },
              RoomTrip.oceanView && {
                icon: <Ship className="h-4 w-4" />,
                text: `${RoomTrip.oceanView} Ocean View`,
              },
              RoomTrip.forestView && {
                icon: <Trees className="h-4 w-4" />,
                text: `${RoomTrip.forestView} Forest View`,
              },
              RoomTrip.mountainView && {
                icon: <MountainSnow className="h-4 w-4" />,
                text: `${RoomTrip.mountainView} Mountain View`,
              },
              RoomTrip.airCondition && {
                icon: <AirVent className="h-4 w-4" />,
                text: "Air Condition",
              },
              RoomTrip.soundProofed && {
                icon: <VolumeX className="h-4 w-4" />,
                text: "Sound Proofed",
              },
            ].filter(Boolean) as { icon: JSX.Element; text: string }[]
          )
            .slice(0, 14)
            .map((amenity, index) => (
              <AmenityItem key={index}>
                {amenity.icon}
                {amenity.text}
              </AmenityItem>
            ))}
        </div>

        <Separator />
        <div className="flex flex-col lg:flex-row lg:gap-4 justify-between">
          <div className="mb-2 lg:mb-0">
            Trip Tour Price:{" "}
            <span className="font-bold">${RoomTrip.roomPrice}</span>
            <span className="text-sx">/person for {Trip.duration} days</span>
          </div>
          {!!RoomTrip.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${RoomTrip.breakFastPrice}</span>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>
              Room booked by {bookingtrip.userName} for{" "}
              {moment(bookingtrip.bookedAt).fromNow()}
            </div>
            {bookingtrip.breakFastIncluded && (
              <div>Breakfast will be served</div>
            )}
            {bookingtrip.member && (
              <div>Total member: {bookingtrip.member}</div>
            )}
            {Trip.arrivalTime && Trip.departureTime && Trip.duration && (
              <div>
                Duration : {formattedDepartureTime} - {formattedArrivalTime} in{" "}
                {Trip.duration} days
              </div>
            )}
            {bookingtrip.paymentStatus ? (
              <div className="text-teal-500">
                Paid ${bookingtrip.totalPrice} - Trip Reserved
              </div>
            ) : (
              <div className="text-rose-500">
                Not Paid ${bookingtrip.totalPrice} - Trip Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={bookingIstLoading}
          variant="outline"
          onClick={() => router.push(`trip-details/${Trip.id}`)}
        >
          View Trip Tour
        </Button>
        {!bookingtrip.paymentStatus && bookingtrip.userId === userId && (
          <Button
            disabled={bookingIstLoading}
            onClick={() => {
              handleBookRoom();
            }}
          >
            {bookingIstLoading ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyBookingsTripClient;
