import React from "react";
import TripStepCard from "../cards/TripStepCard";
import Image from "next/image";

function BookNextTripSection() {
  const steps = [
    {
      id: 0,
      iconUrl: "/images/destination-icon.png",
      title: "Choose Destination",
      description:
        "Select your desired destination from our wide range of options.",
    },
    {
      id: 1,
      iconUrl: "/images/payment-icon.png",
      title: "Make Payment",
      description:
        "Securely complete your payment for the chosen trip using our trusted payment methods.",
    },
    {
      id: 2,
      iconUrl: "/images/airport-icon.png",
      title: "Reach Airport on Selected Date",
      description:
        "Arrive at the airport on the specified date to begin your exciting journey.",
    },
  ];
  return (
    <section className="flex justify-between flex-col md:flex-row items-center mt-[-10rem]">
      <div>
        <p className="text-lightGray text-[1.125rem] font-[600] text-left">
          Easy and Fast
        </p>
        <p className="volkhov text-[3.125rem] text-title font-[700] text-left">
          Book your next trip in 3 easy steps
        </p>

        <div className="flex flex-col gap-[3rem] mt-[1.94rem]">
          {steps.map((step) => (
            <TripStepCard
              key={step.id}
              title={step.title}
              description={step.description}
              iconUrl={step.iconUrl}
            />
          ))}
        </div>
      </div>
      <div>
        <Image
          src="/images/next-trip.png"
          alt="card with a girl on a wall"
          width={400}
          height={300}
        />
      </div>
    </section>
  );
}

export default BookNextTripSection;
