"use client";

import useBookFlight from "@/hooks/useBookFlight";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "@radix-ui/react-dropdown-menu";
import moment from "moment";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { BookingFlight } from "@prisma/client";

interface FlightPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

const FlightPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: FlightPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookFlight();

  const stripe = useStripe();

  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
    //eslint-disable-next-line
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    }

    try {
      const bookings = await axios.get(
        `/api/bookingflight/${bookingRoomData.type.id}`
      );

      const roomBookingDates = bookings.data.map((booking: BookingFlight) => {
        return {
          adultCount: booking.adultCount, // Thêm thông tin về số lượng người lớn
          childrenCount: booking.childrenCount, // Thêm thông tin về số lượng trẻ em
        };
      });

      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`api/bookingflight/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: "success",
                  description: "Room Reserved !",
                });
                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: "Something went wrong!",
                });
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (!bookingRoomData?.adultCount || !bookingRoomData?.childrenCount)
    return <div>Error: Missing data...</div>;

  const adultCount = bookingRoomData.adultCount;
  const childrenCount = bookingRoomData.childrenCount;

  const handleBack = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.back();
  };
  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>

      <AddressElement
        options={{
          mode: "billing",
          //allowedCountries: ["US", "KE"], // Đổi dấu ngoặc nhọn thành dấu ngoặc vuông
        }}
      />
      <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className=" flex flex-col gap-1">
        <h2 className="font-semibold mb-1 text-lg mt-4">
          Your Booking Summary
        </h2>
        <div>You have {adultCount} adult(s) in your group.</div>
        <div>You have {childrenCount} child(ren) in your group.</div>
        {bookingRoomData?.breakFastIncluded && (
          <div>You will be served breakfast each day at 8AM</div>
        )}
      </div>
      <Separator />
      <div className="font-bold text-lg mb-4 mt-4">
        {bookingRoomData?.breakFastIncluded && (
          <div className="mb-2">
            Breakfast Price: ${bookingRoomData.type.breakFastPrice}
          </div>
        )}
        Total Price: ${bookingRoomData?.totalPrice}
      </div>
      {isLoading && (
        <Alert className="bg-indigo-600 text-white">
          <Terminal className="h-4 w-4 stroke-white" />
          <AlertTitle>Payment Processing...</AlertTitle>
          <AlertDescription>
            Please stay on this page as we process your payment
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button disabled={isLoading} className="flex-grow">
          {isLoading ? "Processing Payment..." : "Pay Now"}
        </Button>
        <div className="flex-grow">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 border border-gray-500 rounded-md w-full"
          >
            Back
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FlightPaymentForm;
