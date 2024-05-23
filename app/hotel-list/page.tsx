import { getHotels } from "@/actions/getHotels";
import LocationFilter from "@/components/LocationFilter";
import SearchInput from "@/components/SearchInput";
import HotelList from "@/components/hotel/HotelList";

interface HotelProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const MyHotels = async ({ searchParams }: HotelProps) => {
  const hotels = await getHotels(searchParams);

  if (!hotels) return <div>No trips found!</div>;
  return (
    <div className="text-2xl">
      <HotelList hotels={hotels} />
    </div>
  );
};

export default MyHotels;
