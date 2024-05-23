import React from "react";
import Link from "next/link"; // Import Link from next/link
import DestinationCard from "../cards/DestinationCard";

function TopSellingSection() {
  const destinations = [
    {
      id: 0,
      imageUrl: "/images/rome.png",
      title: "Agrentina",
      amount: "$5.42k",
      duration: "10 Days Trip",
      highlighted: false,
      destinationUrl: "/trip-list?country=AR", // Add destination URL for each destination
    },
    {
      id: 1,
      imageUrl: "/images/london.jpg",
      title: "Aland Islands",
      amount: "$4.2k",
      duration: "12 Days Trip",
      highlighted: false,
      destinationUrl: "/trip-list?country=AX", // Add destination URL for each destination
    },
    {
      id: 2,
      imageUrl: "/images/europe.png",
      title: "Algeria",
      amount: "$15k",
      duration: "28 Days Trip",
      highlighted: true,
      destinationUrl: "/trip-list?country=DZ", // Add destination URL for each destination
    },
  ];
  return (
    <section>
      <p className="text-lightGray text-[1.125rem] font-[600] text-center">
        Top Selling
      </p>
      <p className="volkhov text-[3.125rem] text-title font-[700] text-center">
        Top Destinations
      </p>
      <div className="flex flex-col gap-4 md:flex-row items-center md:justify-between mt-16 w-full">
        {destinations.map((destination) => (
          <Link key={destination.id} href={destination.destinationUrl}>
            <div>
              <DestinationCard
                imageUrl={destination.imageUrl}
                title={destination.title}
                duration={destination.duration}
                amount={destination.amount}
                highlighted={destination.highlighted}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TopSellingSection;
