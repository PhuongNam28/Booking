import { getTripByUserID } from "@/actions/getTripByUserID";
import TripList from "@/components/trips/TripList";

const MyHotels = async () => {
  const trips = await getTripByUserID();

  if (!trips) return <div>No trips found!</div>;
  return (
    <div className="text-2xl">
      <TripList trips={trips} />
    </div>
  );
};

export default MyHotels;
