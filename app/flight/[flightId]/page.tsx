import { getFlightById } from "@/actions/getFlightById";
import AddFlightForm from "@/components/flight/AddFlightForm";

import { auth } from "@clerk/nextjs";

interface FlightPageProps {
  params: {
    flightId: string;
  };
}

const Hotel = async ({ params }: FlightPageProps) => {
  const flight = await getFlightById(params.flightId);
  const { userId } = auth();

  if (!userId) return <div>Not authenticated...</div>;

  if (flight && flight.userId != userId) return <div>Acccess denied...</div>;
  return (
    <div>
      <AddFlightForm flight={flight} />
    </div>
  );
};

export default Hotel;
