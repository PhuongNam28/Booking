"use client";
import { Booking, Hotel, Room } from "@prisma/client";
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
import useBookRoom from "@/hooks/useBookRoom";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
import { Button } from "../ui/button";

interface MyBookingClientProps {
  booking: Booking & { Room: Room | null } & { Hotel: Hotel | null };
}

const MyBookingClient: React.FC<MyBookingClientProps> = ({ booking }) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIstLoading, setBookingIsLoading] = useState(false);

  const { getCountryByCode, getStateByCode } = useLocation();

  const { userId } = useAuth();

  const { toast } = useToast();

  const router = useRouter();

  const { Hotel, Room } = booking;

  if (!Hotel || !Room) return <div>Missing Data...</div>;

  const country = getCountryByCode(Hotel.country);

  const state = getStateByCode(Hotel.country, Hotel.state);

  const startDate = moment(booking.startDate).format("MMMM Do YYYY");

  const endDate = moment(booking.endDate).format("MMMM Do YYYY");

  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!Hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    setBookingIsLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };
    setRoomData(bookingRoomData);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerId: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          startDate: bookingRoomData.startDate,
          endDate: bookingRoomData.endDate,
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
        router.push("/book-room");
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
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name},{state?.name},{Hotel.city}
            </AmenityItem>
          </div>
          <p className="pb-2">{Hotel.locationDescription}</p>
        </CardDescription>
        <CardTitle>{Room.title}</CardTitle>
        <CardDescription>{Room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              {
                icon: <Bed className="h-4 w-4" />,
                text: `${Room.bedCount} Bed(s)`,
              },
              {
                icon: <User className="h-4 w-4" />,
                text: `${Room.guestCount} Guest(s)`,
              },
              !!Room.kingBed && {
                icon: <BedDouble className="h-4 w-4" />,
                text: `${Room.kingBed} King Bed(s)`,
              },
              !!Room.queenBed && {
                icon: <Bed className="h-4 w-4" />,
                text: `${Room.queenBed} Queen Bed(s)`,
              },
              Room.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              Room.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${Room.TV} TV`,
              },
              Room.balcony && {
                icon: <Home className="h-4 w-4" />,
                text: `${Room.balcony} Balcony`,
              },
              Room.freeWifi && {
                icon: <Wifi className="h-4 w-4" />,
                text: "Free Wifi",
              },
              Room.cityView && {
                icon: <Castle className="h-4 w-4" />,
                text: `${Room.cityView} City View`,
              },
              Room.oceanView && {
                icon: <Ship className="h-4 w-4" />,
                text: `${Room.oceanView} Ocean View`,
              },
              Room.forestView && {
                icon: <Trees className="h-4 w-4" />,
                text: `${Room.forestView} Forest View`,
              },
              Room.mountainView && {
                icon: <MountainSnow className="h-4 w-4" />,
                text: `${Room.mountainView} Mountain View`,
              },
              Room.airCondition && {
                icon: <AirVent className="h-4 w-4" />,
                text: "Air Condition",
              },
              Room.soundProofed && {
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
            Room Price: <span className="font-bold">${Room.roomPrice}</span>
            <span className="text-sx">/24hrs</span>
          </div>
          {!!Room.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${Room.breakFastPrice}</span>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>
              Room booked by {booking.userName} for {dayCount} days -{" "}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Check-in: {startDate} at 5PM</div>
            <div>Check-out: {endDate} at 5PM</div>
            {booking.breakFastIncluded && <div>Breakfast will be served</div>}
            {booking.paymentStatus ? (
              <div className="text-teal-500">
                Paid ${booking.totalPrice} - Room Reserved
              </div>
            ) : (
              <div className="text-rose-500">
                Not Paid ${booking.totalPrice} - Room Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={bookingIstLoading}
          variant="outline"
          onClick={() => router.push(`hotel-details/${Hotel.id}`)}
        >
          View Hotel
        </Button>
        {!booking.paymentStatus && booking.userId === userId && (
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

export default MyBookingClient;
