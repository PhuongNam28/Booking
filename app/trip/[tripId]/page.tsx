import { getTripById } from "@/actions/getTripById";
import AddTripForm from "@/components/trips/AddTripForm";
import { auth } from "@clerk/nextjs";

interface TripPageProps {
  params: {
    tripId: string;
  };
}

const Trip = async ({ params }: TripPageProps) => {
  const trip = await getTripById(params.tripId);
  const { userId } = auth();

  if (!userId) return <div>Not authenticated...</div>;

  if (trip && trip.userId != userId) return <div>Acccess denied...</div>;
  return (
    <div>
      <AddTripForm trip={trip} />
    </div>
  );
};

export default Trip;
