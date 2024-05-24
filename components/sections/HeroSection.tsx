"use client";
import React from "react";
import Image from "next/image";
import MainButton from "../common/MainButton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function HeroSection() {
  const router = useRouter();

  const handleTrip = () => {
    router.push("/trip-list");
  };
  return (
    <section className="flex justify-between items-center mt-16 md:z-[9999]">
      <div className="pt-32 md:pt-4">
        <p className="text-[1.128rem] font-[700] text-primary uppercase mb-4">
          Best Destinations around the world
        </p>
        <div className="flex flex-col">
          <div className="volkhov font-[700] text-[3rem] md:text-[4.73756rem] leading-large inline-flex text-lightBlue">
            Travel,
            <div className="flex flex-col">
              <span className="ml-8 z-10">enjoy</span>
              <Image
                src="/images/stylish-underline.png"
                alt="stylish underline"
                width={300}
                height={20}
                className="-mt-4 z-0 hidden md:block"
              />
            </div>
          </div>

          <p className="volkhov font-[700] text-[3rem] md:text-[4.73756rem] leading-large inline-flex text-lightBlue">
            and live a new and full life
          </p>
        </div>

        <p className="my-[1.6rem] font-bold leading-[1.692rem] text-lightGray text-[1rem]">
          Built Wicket longer admire do barton vanity itself do in it. Preferred
          to sportsmen it engrossed listening. Park gate sell they west hard for
          the.
        </p>

        <div className="flex gap-6 items-center">
          <div>
            <Button
              onClick={handleTrip}
              className="rounded-md bg-green-500 text-white px-4 py-2"
            >
              Find your more
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Image
          src="/images/lady-with-aircraft.png"
          alt="girl with phone with aircrafts on the background"
          width={500}
          height={500}
        />
      </div>
    </section>
  );
}

export default HeroSection;
