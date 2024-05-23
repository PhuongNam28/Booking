import React from "react";
import { Input } from "../ui/input";
import MainButton from "../common/MainButton";
import Image from "next/image";

function NewsLetterSection() {
  return (
    <div className="bg-[#DFD7F9] p-[4rem] rounded-[1.25rem] rounded-tl-extraLarge relative lg:-mt-[10rem]">
      <div className="z-20">
        <p className="text-lightGray text-[1.5rem] font-[600] text-center mb-[2.63rem]">
          Subscribe to get information, latest news and other{" "}
          <br className="hidden md:block" /> interesting offers about PalmTree
        </p>

        <div className="flex justify-between flex-col md:flex-row items-center gap-8">
          <div className="relative flex-grow z-[10]">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-white h-[3.5rem] pl-[3rem]"
            />
            <div className="absolute top-5 left-4">
              <Image
                src="/images/envelop.png"
                alt="envelope icon"
                width={24}
                height={24}
              />
            </div>
          </div>

          <MainButton
            text="Subscribe"
            classes="w-[9.25rem] h-[3.25rem] z-[10]"
            isGradient
          />
        </div>
      </div>
      <div className="absolute bottom-0  left-4 z-0 opacity-25">
        <Image
          src="/images/round-ring-left.png"
          alt="round ring left"
          width={200}
          height={200}
        />
      </div>

      <div className="absolute -top-4 -right-4">
        <Image
          src="/images/send-shape.png"
          alt="send icon"
          width={24}
          height={24}
        />
      </div>

      <div className="absolute top-0 right-0 opacity-25">
        <Image
          src="/images/round-ring-right.png"
          alt="round ring right"
          width={200}
          height={200}
        />
      </div>

      <div className="absolute -bottom-16 right-[-6rem] hidden md:block">
        <Image
          src="/images/plus-group.png"
          alt="send icon"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}

export default NewsLetterSection;
