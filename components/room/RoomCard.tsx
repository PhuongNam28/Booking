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
import AddRoomForm from "./AddRoomForm";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();

  const [isLoading, setIsLoading] = useState(false);

  const [bookingIsLoading, setBookingsisLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>();

  const [totalPrice, setTotalPrice] = useState(room.roomPrice);

  const [includeBreakFast, setIncludeBreakFast] = useState(false);

  const [days, setDays] = useState(1);

  const router = useRouter();
  const { toast } = useToast();

  const { userId } = useAuth();

  const pathname = usePathname();

  const isHotelDeTailsPage = pathname.includes("hotel-details");

  const isBookRoom = pathname.includes("book-room");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
    //eslint-disable-next-line
  }, [date, room.roomPrice, includeBreakFast]);

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Something went wrong!",
      });

    if (date?.from && date?.to) {
      setBookingsisLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
      };
      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
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
    } else {
      toast({
        variant: "destructive",
        description: "Oops! Select Date",
      });
    }
  };

  const handleRoomDelete = (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/" + 1));

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
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

  const disabledDates = React.useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id && booking.paymentStatus
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range]; // Merge the new range into existing dates
    });

    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          {(
            [
              {
                icon: <Bed className="h-4 w-4" />,
                text: `${room.bedCount} Bed(s)`,
              },
              {
                icon: <User className="h-4 w-4" />,
                text: `${room.guestCount} Guest(s)`,
              },
              !!room.kingBed && {
                icon: <BedDouble className="h-4 w-4" />,
                text: `${room.kingBed} King Bed(s)`,
              },
              !!room.queenBed && {
                icon: <Bed className="h-4 w-4" />,
                text: `${room.queenBed} Queen Bed(s)`,
              },
              room.roomService && {
                icon: <UtensilsCrossed className="h-4 w-4" />,
                text: "Room Service",
              },
              room.TV && {
                icon: <Tv className="h-4 w-4" />,
                text: `${room.TV} TV`,
              },
              room.balcony && {
                icon: <Home className="h-4 w-4" />,
                text: `${room.balcony} Balcony`,
              },
              room.freeWifi && {
                icon: <Wifi className="h-4 w-4" />,
                text: "Free Wifi",
              },
              room.cityView && {
                icon: <Castle className="h-4 w-4" />,
                text: `${room.cityView} City View`,
              },
              room.oceanView && {
                icon: <Ship className="h-4 w-4" />,
                text: `${room.oceanView} Ocean View`,
              },
              room.forestView && {
                icon: <Trees className="h-4 w-4" />,
                text: `${room.forestView} Forest View`,
              },
              room.mountainView && {
                icon: <MountainSnow className="h-4 w-4" />,
                text: `${room.mountainView} Mountain View`,
              },
              room.airCondition && {
                icon: <AirVent className="h-4 w-4" />,
                text: "Air Condition",
              },
              room.soundProofed && {
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
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-sx">/24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${room.breakFastPrice}</span>
            </div>
          )}
        </div>

        <Separator />
      </CardContent>
      {!isBookRoom && (
        <CardFooter>
          {isHotelDeTailsPage ? (
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2">
                  Select the days that you will spend in this room
                </div>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabledDates={disabledDates}
                />
              </div>
              {room.breakFastPrice > 0 && (
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
                {bookingIsLoading ? "Loading..." : "Book Room"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row w-full justify-between items-center">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                onClick={() => {
                  handleRoomDelete(room);
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
                      Update Room
                    </span>{" "}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Room</DialogTitle>
                    <DialogDescription>
                      Make changes to this room
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    hotel={hotel}
                    room={room}
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

export default RoomCard;
