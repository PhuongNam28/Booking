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
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  Loader2,
  MountainSnow,
  Pencil,
  Plus,
  Ship,
  Trash,
  Trees,
  Tv,
  User,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";

import useBookFlight from "@/hooks/useBookFlight";
import { FaCar, FaChair, FaLuggageCart } from "react-icons/fa";
import {
  MdChair,
  MdFoodBank,
  MdLowPriority,
  MdSupportAgent,
} from "react-icons/md";
import AddTypeForm from "./AddTypeForm";

interface FlightCardProps {
  flight?: Flight & {
    types: typeFlight[];
  };
  type: typeFlight;
  bookingflight?: BookingFlight[];
}

const RoomTypeCard = ({
  flight,
  type,
  bookingflight = [],
}: FlightCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookFlight();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIsLoading, setBookingsisLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [totalPrice, setTotalPrice] = useState(type.roomPrice);

  const [availableSeats, setAvailableSeats] = useState(type.availableSeats);

  const [includeBreakFast, setIncludeBreakFast] = useState(false);

  const [adultCount, setAdultCount] = useState<number>(0);

  const [childrenCount, setChildrenCount] = useState<number>(0);

  const router = useRouter();
  const { toast } = useToast();

  const { userId } = useAuth();

  const pathname = usePathname();

  const isTripDeTailsPage = pathname.includes("flight-details");

  const isBookRoomTrip = pathname.includes("book-room-flight");

  useEffect(() => {
    if (
      adultCount !== undefined ||
      (childrenCount !== undefined &&
        type &&
        type.availableSeats !== undefined &&
        includeBreakFast !== undefined)
    ) {
      if (adultCount + childrenCount <= type.availableSeats) {
        let totalPrice = 0;

        const adultPrice = adultCount * type.roomPrice;
        const childrenPrice = childrenCount * type.roomPrice * 0.2;

        totalPrice = adultPrice + childrenPrice;

        if (includeBreakFast && type.breakFastPrice) {
          totalPrice += type.breakFastPrice;
        }

        setTotalPrice(totalPrice);
      } else {
        // Xử lý trường hợp không đủ chỗ trống
        // Ví dụ: hiển thị thông báo cho người dùng
        console.log("Not enough available seats");
      }
    }
  }, [
    type.roomPrice,
    type.breakFastPrice,
    includeBreakFast,
    adultCount,
    childrenCount,
    type,
  ]);

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  // Hàm xử lý thay đổi giá trị cho số lượng người lớn

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!flight?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (adultCount + childrenCount > type.availableSeats) {
      return toast({
        variant: "destructive",
        description: "Not available Seats!",
      });
    }

    if (adultCount || childrenCount) {
      setBookingsisLoading(true);

      const bookingRoomData = {
        type,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        adultCount,
        childrenCount,
        availableSeats,
      };
      setRoomData(bookingRoomData);

      fetch("/api/create-payment-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingFlight: {
            flightOwnerId: flight.userId,
            flightId: flight.id,
            typeFlightId: type.id,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
            adultCount: adultCount,
            childrenCount: childrenCount,
            availableSeats: availableSeats,
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingsisLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-flight");
        })
        .catch((error: any) => {
          console.log("Error:", error);
          toast({
            variant: "destructive",
            description: `ERROR ! ${error.message}`,
          });
          setIsLoading(false);
        });
    } else {
      toast({
        variant: "destructive",
        description: "Oops! Select Count",
      });
    }
  };

  const handleRoomDelete = (type: typeFlight) => {
    setIsLoading(true);
    const imageKey = type.image.substring(type.image.lastIndexOf("/" + 1));

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/type/${type.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Type Delete!",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Something went wrong!",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something went wrong!",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type.title}</CardTitle>
        <CardDescription>{type.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={type.image}
            alt={type.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              // Dịch vụ cho vé thường
              type.serviceMeal && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Service Meal",
              },
              type.serviceBaggage && {
                icon: <FaLuggageCart className="h-4 w-4" />,
                text: "Service Baggage",
              },
              type.seatSelection && {
                icon: <FaChair className="h-4 w-4" />,
                text: "Seat Selection",
              },
              type.priorityBoarding && {
                icon: <MdLowPriority className="h-4 w-4" />,
                text: "Priority Boarding",
              },
              // Dịch vụ cho vé VIP
              type.loungeAccess && {
                icon: <MdChair className="h-4 w-4" />,
                text: "Lounge Access",
              },
              type.luxuryMeal && {
                icon: <MdFoodBank className="h-4 w-4" />,
                text: "Luxury Meal",
              },
              type.limousine && {
                icon: <FaCar className="h-4 w-4" />,
                text: "Limousine",
              },
              type.personalButler && {
                icon: <MdSupportAgent className="h-4 w-4" />,
                text: "Personal Butler",
              },
              type.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              type.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${type.TV} TV`,
              },

              type.freeWifi && {
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
            Flight Price: <span className="font-bold">${type.roomPrice}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-4 justify-between">
          <div className="mb-2 lg:mb-0">
            Available Seats:{" "}
            <span className="font-bold">{type.availableSeats}</span>
          </div>
        </div>

        <Separator />
      </CardContent>
      {!isBookRoomTrip && (
        <CardFooter>
          {isTripDeTailsPage ? (
            <div className="flex flex-col gap-6">
              {type.availableSeats > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <label htmlFor="adultCountInput" className="text-sm">
                      Adult Count:
                    </label>
                    <input
                      type="number"
                      id="adultCountInput"
                      min={0}
                      value={adultCount}
                      onChange={(e) =>
                        setAdultCount(parseInt(e.target.value, 10))
                      }
                      className="border rounded-sm p-2 w-32"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="childrenCountInput" className="text-sm">
                      Children Count:
                    </label>
                    <input
                      type="number"
                      id="childrenCountInput"
                      min={0}
                      value={childrenCount}
                      onChange={(e) =>
                        setChildrenCount(parseInt(e.target.value, 10))
                      }
                      className="border rounded-sm p-2 w-32"
                    />
                  </div>
                </div>
              )}
              {type.breakFastPrice > 0 && (
                <div>
                  <div className="mb-2">
                    Do you want to be served breakfast each day
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breakFast"
                      onCheckedChange={(value) => setIncludeBreakFast(!!value)}
                    />
                    <label htmlFor="breakFast" className="text-sm">
                      Include BreakFast
                    </label>
                  </div>
                </div>
              )}

              <div>
                Total Price: <span className="font-bold">${totalPrice}</span>{" "}
              </div>

              <div>
                Available Seats:{" "}
                <span className="font-bold">${type.availableSeats}</span>{" "}
              </div>

              <Button
                onClick={() => handleBookRoom()}
                disabled={bookingIsLoading}
                type="button"
              >
                {bookingIsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {bookingIsLoading ? "Loading..." : "Book Flight"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={() => {
                  handleRoomDelete(type);
                }}
                className="mb-2 lg:mb-0" // Add margin bottom for small screens
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="max-w-[150px] flex items-center"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span className="overflow-hidden overflow-ellipsis">
                      Update Flight
                    </span>{" "}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Flight</DialogTitle>
                    <DialogDescription>
                      Make changes to this flight
                    </DialogDescription>
                  </DialogHeader>
                  <AddTypeForm
                    flight={flight}
                    type={type}
                    handleDialogueOpen={handleDialogueOpen}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RoomTypeCard;
