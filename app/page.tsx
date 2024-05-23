import Image from "next/image";
import BookNextTripSection from "@/components/sections/BookNextTripSection";
import CategorySection from "@/components/sections/CategorySection";
import FooterSection from "@/components/sections/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import LogoGroupSection from "@/components/sections/LogoGroupSection";
import NewsLetterSection from "@/components/sections/NewsLetterSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
7;
import TopSellingSection from "@/components/sections/TopSellingSection";

export default function Home() {
  return (
    <main className="relative poppins md:px-[9rem]">
      <div className="px-4 flex flex-col gap-[7.69rem]">
        <HeroSection />
        <div className="absolute top-0 right-0 -z-10">
          <Image
            src="/images/blob-shape.png"
            alt="blob background shape"
            width={500}
            height={500}
          />
        </div>
        <div className="absolute top-0 left-0 -z-10">
          <Image
            src="/images/top-left-gradient.png"
            alt="blob background shape"
            width={500}
            height={500}
          />
        </div>
        <div className="relative">
          <CategorySection />
          <div className="absolute top-0 right-0">
            <Image
              src="/images/plus-group.png"
              alt="blob background shape"
              width={500}
              height={500}
            />
          </div>
        </div>

        <TopSellingSection />
        <BookNextTripSection />
        <TestimonialSection />
        <LogoGroupSection />
        <NewsLetterSection />
        <FooterSection />
      </div>
    </main>
  );
}
