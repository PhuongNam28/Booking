import { getFlights } from "@/actions/getFlights";
import FlightList from "@/components/flight/FlightList";

interface FlightProps {
  searchParams: {
    name: string;
    fromCountry: string;
    toCountry: String;
  };
}

const MyFlights = async ({ searchParams }: FlightProps) => {
  const flights = await getFlights(searchParams);

  if (!flights) return <div>No Flights found!</div>;
  return (
    <div className="text-2xl">
      <FlightList flights={flights} />
    </div>
  );
};

export default MyFlights;
