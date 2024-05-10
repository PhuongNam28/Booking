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
import AddRoomTripForm from "./AddRoomTripForm";
import useBookTrip from "@/hooks/useBookTrip";

interface RoomTripCardProps {
  trip?: Trip & {
    roomtrips: RoomTrip[];
  };
  roomtrip: RoomTrip;
  bookingtrips?: BookingTrip[];
}

const RoomTripCard = ({
  trip,
  roomtrip,
  bookingtrips = [],
}: RoomTripCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookTrip();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIsLoading, setBookingsisLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [totalPrice, setTotalPrice] = useState(roomtrip.roomPrice);

  const [includeBreakFast, setIncludeBreakFast] = useState(false);

  const [member, setMember] = useState<number>(0);

  const [availableSeats, setAvailableSeats] = useState(roomtrip.availableSeats);

  const [days, setDays] = useState(1);

  const router = useRouter();
  const { toast } = useToast() as any;

  const { userId } = useAuth();

  const pathname = usePathname();

  const isTripDeTailsPage = pathname.includes("trip-details");

  const isBookRoomTrip = pathname.includes("book-room-trip");

  useEffect(() => {
    if (roomtrip.roomPrice && member) {
      let totalPrice = roomtrip.roomPrice * member;

      if (includeBreakFast && roomtrip.breakFastPrice) {
        totalPrice += roomtrip.breakFastPrice;
      }

      setTotalPrice(totalPrice);
    } else {
      setTotalPrice(0); // hoặc một giá trị mặc định khác nếu cần
    }

    //eslint-disable-next-line
  }, [roomtrip.roomPrice, includeBreakFast, member]);

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!trip?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (member < roomtrip.availableSeats) {
      setBookingsisLoading(true);

      const bookingRoomData = {
        roomtrip,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        member,
        availableSeats,
      };
      setRoomData(bookingRoomData);

      fetch("/api/create-payment-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingtrip: {
            tripOwnerId: trip.userId,
            tripId: trip.id,
            roomtripId: roomtrip.id,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
            availableSeats: availableSeats,
            member: member,
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
    } else {
      toast({
        variant: "destructive",
        description: "Not available Seats!",
      });
    }
  };

  const handleRoomDelete = (roomtrip: RoomTrip) => {
    setIsLoading(true);
    const imageKey = roomtrip.image.substring(
      roomtrip.image.lastIndexOf("/" + 1)
    );

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/roomtrip/${roomtrip.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room Delete!",
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
        <CardTitle>{roomtrip.title}</CardTitle>
        <CardDescription>{roomtrip.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={roomtrip.image}
            alt={roomtrip.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              {
                icon: <Bed className="h-4 w-4" />,
                text: `${roomtrip.bedCount} Bed(s)`,
              },
              {
                icon: <User className="h-4 w-4" />,
                text: `${roomtrip.guestCount} Guest(s)`,
              },
              !!roomtrip.kingBed && {
                icon: <BedDouble className="h-4 w-4" />,
                text: `${roomtrip.kingBed} King Bed(s)`,
              },
              !!roomtrip.queenBed && {
                icon: <Bed className="h-4 w-4" />,
                text: `${roomtrip.queenBed} Queen Bed(s)`,
              },
              roomtrip.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              roomtrip.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${roomtrip.TV} TV`,
              },
              roomtrip.balcony && {
                icon: <Home className="h-4 w-4" />,
                text: `${roomtrip.balcony} Balcony`,
              },
              roomtrip.freeWifi && {
                icon: <Wifi className="h-4 w-4" />,
                text: "Free Wifi",
              },
              roomtrip.cityView && {
                icon: <Castle className="h-4 w-4" />,
                text: `${roomtrip.cityView} City View`,
              },
              roomtrip.oceanView && {
                icon: <Ship className="h-4 w-4" />,
                text: `${roomtrip.oceanView} Ocean View`,
              },
              roomtrip.forestView && {
                icon: <Trees className="h-4 w-4" />,
                text: `${roomtrip.forestView} Forest View`,
              },
              roomtrip.mountainView && {
                icon: <MountainSnow className="h-4 w-4" />,
                text: `${roomtrip.mountainView} Mountain View`,
              },
              roomtrip.airCondition && {
                icon: <AirVent className="h-4 w-4" />,
                text: "Air Condition",
              },
              roomtrip.soundProofed && {
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
            <span className="font-bold">${roomtrip.roomPrice}</span>
            <span className="text-sx">/person</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-4 justify-between">
          <div className="mb-2 lg:mb-0">
            Availables Seats:{" "}
            <span className="font-bold">
              {roomtrip.availableSeats} {""} people
            </span>
          </div>
        </div>

        <Separator />
      </CardContent>
      {!isBookRoomTrip && (
        <CardFooter>
          {isTripDeTailsPage ? (
            <div className="flex flex-col gap-6">
              {roomtrip.availableSeats > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <label htmlFor="memberInput" className="text-sm">
                      Member
                    </label>
                    <input
                      type="number"
                      id="memberInput"
                      min={0}
                      value={member}
                      onChange={(e) => setMember(parseInt(e.target.value, 10))}
                      className="border rounded-sm p-2 w-32"
                    />
                  </div>
                </div>
              )}
              {roomtrip.breakFastPrice > 0 && (
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
                for <span className="font-bold">{days}</span>
              </div>

              <div>
                Available Seats:{" "}
                <span className="font-bold">
                  {roomtrip.availableSeats} person
                </span>{" "}
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
                {bookingIsLoading ? "Loading..." : "Book Trip"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={() => {
                  handleRoomDelete(roomtrip);
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
                      Update Trip
                    </span>{" "}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Trip</DialogTitle>
                    <DialogDescription>
                      Make changes to this trip
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomTripForm
                    trip={trip}
                    roomtrip={roomtrip}
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

export default RoomTripCard;
