import { getBookFlight } from "@/actions/getBookFlight";
import { getFlightById } from "@/actions/getFlightById";
import FlightDetailsClient from "@/components/flight/FlightDetailsClient";

interface FlightDetailsProps {
  params: {
    flightId: string;
  };
}
const FlightDetails = async ({ params }: FlightDetailsProps) => {
  const flight = await getFlightById(params.flightId);
  if (!flight) return <div>Oop! Hotel with the given Id not found.</div>;

  const bookings = await getBookFlight(flight.id);

  return (
    <div>
      <FlightDetailsClient flight={flight} bookings={bookings} />
    </div>
  );
};

export default FlightDetails;
