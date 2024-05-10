"use client";

import useBookFlight from "@/hooks/useBookFlight";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import FlightPaymentForm from "./FlightPaymentForm";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import RoomTypeCard from "../type/RoomTypeCard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookFlitghtClient = () => {
  const { bookingRoomData, clientSecret } = useBookFlight();

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [pageLoaded, setPageLoaded] = useState(false);

  const { theme } = useTheme();

  const router = useRouter();

  const topOfPageRef = useRef<HTMLDivElement>(null); // Create a ref

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      topOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [paymentSuccess]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  if (pageLoaded && !paymentSuccess && (!bookingRoomData || !clientSecret))
    return (
      <div className="flex items-center flex-col gap-4">
        <div className="text-rose-500">
          Oops! This page could not be propery loaded...
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Go home
          </Button>
          <Button onClick={() => router.push("/my-bookings-flight")}>
            View Bookings Flight
          </Button>
        </div>
      </div>
    );

  if (paymentSuccess)
    return (
      <div className="flex items-center flex-col gap-4" ref={topOfPageRef}>
        <div className="text-teal-500 text-center">Payment Success</div>
        <Button onClick={() => router.push("/my-bookings-flight")}>
          View Bookings
        </Button>
      </div>
    );
  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold">
            Complete payment to reserve this room!
          </h3>

          <div className="mb-6">
            <RoomTypeCard type={bookingRoomData.type} />
          </div>

          <Elements options={options} stripe={stripePromise}>
            <FlightPaymentForm
              clientSecret={clientSecret}
              handleSetPaymentSuccess={handleSetPaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookFlitghtClient;
