import { getHotelByUserID } from "@/actions/getHotelByUserID";
import HotelList from "@/components/hotel/HotelList";

const MyHotels = async () => {
  const hotels = await getHotelByUserID();

  if (!hotels) return <div>No hotels found!</div>;
  return (
    <div className="text-2xl">
      <HotelList hotels={hotels} />
    </div>
  );
};

export default MyHotels;
