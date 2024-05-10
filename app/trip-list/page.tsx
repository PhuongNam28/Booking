import { getTrips } from "@/actions/getTrips";
import TripList from "@/components/trips/TripList";

interface TripProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

const MyTrips = async ({ searchParams }: TripProps) => {
  const trips = await getTrips(searchParams);

  if (!trips) return <div>No trips found!</div>;
  return (
    <div className="text-2xl">
      <TripList trips={trips} />
    </div>
  );
};

export default MyTrips;
