import { getTripById } from "@/actions/getTripById";
import TripDetailsClient from "@/components/trips/TripDetailsClient";

interface TripDetailsProps {
  params: {
    tripId: string;
  };
}
const TripDetails = async ({ params }: TripDetailsProps) => {
  const trip = await getTripById(params.tripId);
  if (!trip) return <div>Oop! Trips with the given Id not found.</div>;

  return (
    <div>
      <TripDetailsClient trip={trip} />
    </div>
  );
};

export default TripDetails;
