"use client";
import React, { useState } from "react";
import Image from "next/image";
import TestimonialCard from "../cards/TestimonialCard";

function TestimonialSection() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0); // Chỉ số của nhận xét hiện tại

  const reviews = [
    {
      id: 0,
      imageUrl: "/images/mike.png",
      reviewerName: "Mike Taylor",
      position: "Lahore, Pakistan",
      review:
        "I had an incredible experience with this service! The staff were friendly and helpful, and the accommodations exceeded my expectations. The location was perfect, and I would highly recommend it to anyone looking for a memorable trip.",
    },
    {
      id: 1,
      imageUrl: "/images/mike.png",
      reviewerName: "Chris Thomas",
      position: "CEO of Red Button",
      review:
        "I've been using this service for several years now, and I've never been disappointed. The attention to detail and level of professionalism are unparalleled. I highly recommend it to anyone looking for a reliable and top-notch travel experience.",
    },
  ];

  // Hàm để chuyển sang nhận xét tiếp theo
  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Hàm để chuyển đến nhận xét trước đó
  const previousReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="flex justify-between flex-col xl:flex-row items-center lg:-mt-[5rem] gap-16">
      <div>
        <p className="text-lightGray text-[1.125rem] font-[600] text-left uppercase">
          Testimonials
        </p>
        <p className="volkhov text-[3.125rem] text-title font-[700] text-left">
          What People Say About Us.
        </p>

        <div className="mt-[5.12rem] ">
          <Image
            src="/images/slide-indicator.png"
            alt="slide indicator"
            className="hidden md:block"
            width={100}
            height={100}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-[4.12rem]">
        <div className="relative">
          <TestimonialCard
            key={reviews[currentReviewIndex].id}
            position={reviews[currentReviewIndex].position}
            review={reviews[currentReviewIndex].review}
            reviewerName={reviews[currentReviewIndex].reviewerName}
            imageUrl={reviews[currentReviewIndex].imageUrl}
          />
        </div>
        <div className="flex flex-col gap-16">
          <div className="hover:cursor-pointer">
            <button onClick={previousReview}>
              <Image
                src="/images/chevron-up.png"
                alt="cheerup"
                width={50}
                height={50}
              />
            </button>
          </div>
          <div className="hover:cursor-pointer">
            <button onClick={nextReview}>
              <Image
                src="/images/chevron-down.png"
                alt="cheererdown"
                width={50}
                height={50}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
