"use client";
import { BookingFlight, Flight, typeFlight } from "@prisma/client";
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

import { useAuth } from "@clerk/nextjs";
import useBookFlight from "@/hooks/useBookFlight";
import useLocation from "@/hooks/useLocation";

import { Button } from "../ui/button";
import { FaCar, FaChair, FaLuggageCart } from "react-icons/fa";
import {
  MdChair,
  MdFoodBank,
  MdLowPriority,
  MdSupportAgent,
} from "react-icons/md";
import moment from "moment";
import { format } from "date-fns";

interface MyBookingFlightClientProps {
  bookingflight: BookingFlight & { Type: typeFlight | null } & {
    Flight: Flight | null;
  };
}

const MyBookingFlightClient: React.FC<MyBookingFlightClientProps> = ({
  bookingflight,
}) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookFlight();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIstLoading, setBookingIsLoading] = useState(false);

  const { getCountryByCode, getStateByCode } = useLocation();

  const { userId } = useAuth();

  const { toast } = useToast();

  const router = useRouter();

  const { Flight, Type } = bookingflight;

  if (!Flight || !Type) return <div>Missing Data...</div>;

  const fromCountry = getCountryByCode(Flight.fromCountry);

  const toCountry = getCountryByCode(Flight.toCountry);

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!Flight?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    setBookingIsLoading(true);

    const bookingRoomData = {
      type: Type,
      totalPrice: bookingflight.totalPrice,
      breakFastIncluded: bookingflight.breakFastIncluded,
      adultCount: bookingflight.adultCount,
      childrenCount: bookingflight.childrenCount,
    };
    setRoomData(bookingRoomData);

    fetch("/api/create-payment-flight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          flightOwnerId: Flight.userId,
          flightId: Flight.id,
          typeFlightId: Type.id,
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
        router.push("/book-room-flight");
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

  const formattedDepartureTime = format(
    new Date(Flight.departureTime),
    "HH:mm - dd/MM/yyyy"
  );

  // Định dạng thời gian arrivalTime
  const formattedArrivalTime = format(
    new Date(Flight.arrivalTime),
    "HH:mm - dd/MM/yyyy"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Flight.name}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {fromCountry?.name}

              <MapPin className="h-4 w-4" />
              {toCountry?.name}
            </AmenityItem>
          </div>
          <p className="pb-2">{Flight.description}</p>
        </CardDescription>
        <CardTitle>{Type.title}</CardTitle>
        <CardDescription>{Type.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Type.image}
            alt={Type.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              // Dịch vụ cho vé thường
              Type.serviceMeal && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Service Meal",
              },
              Type.serviceBaggage && {
                icon: <FaLuggageCart className="h-4 w-4" />,
                text: "Service Baggage",
              },
              Type.seatSelection && {
                icon: <FaChair className="h-4 w-4" />,
                text: "Seat Selection",
              },
              Type.priorityBoarding && {
                icon: <MdLowPriority className="h-4 w-4" />,
                text: "Priority Boarding",
              },
              // Dịch vụ cho vé VIP
              Type.loungeAccess && {
                icon: <MdChair className="h-4 w-4" />,
                text: "Lounge Access",
              },
              Type.luxuryMeal && {
                icon: <MdFoodBank className="h-4 w-4" />,
                text: "Luxury Meal",
              },
              Type.limousine && {
                icon: <FaCar className="h-4 w-4" />,
                text: "Limousine",
              },
              Type.personalButler && {
                icon: <MdSupportAgent className="h-4 w-4" />,
                text: "Personal Butler",
              },
              Type.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              Type.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${Type.TV} TV`,
              },

              Type.freeWifi && {
                icon: <Wifi className="h-4 w-4" />,
                text: "Free Wifi",
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
            Flight Price: <span className="font-bold">${Type.roomPrice}</span>
          </div>
          {!!Type.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${Type.breakFastPrice}</span>
            </div>
          )}
        </div>

        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>
              Room booked by {bookingflight.userName} for {""}
              {moment(bookingflight.bookedAt).fromNow()}
            </div>

            {bookingflight.breakFastIncluded && (
              <div>Breakfast will be served</div>
            )}
            {Flight.departureTime && Flight.arrivalTime && (
              <div>
                <p>Departure time: {formattedDepartureTime}</p>
                <p>Arrival time: {formattedArrivalTime}</p>
                <p>Duration: {Flight.duration} hours</p>
              </div>
            )}

            {bookingflight.paymentStatus ? (
              <div className="text-teal-500">
                Paid ${bookingflight.totalPrice} - Flight Reserved
              </div>
            ) : (
              <div className="text-rose-500">
                Not Paid ${bookingflight.totalPrice} - Flight Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={bookingIstLoading}
          variant="outline"
          onClick={() => router.push(`flight-details/${Flight.id}`)}
        >
          View Flight
        </Button>
        {!bookingflight.paymentStatus && bookingflight.userId === userId && (
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

export default MyBookingFlightClient;
