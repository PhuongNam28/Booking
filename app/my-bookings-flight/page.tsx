import { getBookingFlightByUserId } from "@/actions/getBookingFlightByUserId";
import { getBookingByFlightId } from "@/actions/getBookingByFlightId";
import MyBookingsFlightClient from "@/components/bookingflight/MyBookingsFlightClient";

const MyBookingFlights = async () => {
  const bookingsFromVisitors = await getBookingFlightByUserId();
  const bookingsIHaveMade = await getBookingByFlightId();
  if (!bookingsFromVisitors && !bookingsIHaveMade)
    return <div>No bookings Flight found</div>;
  return (
    <div className="flex flex-col gap-10">
      {!!bookingsIHaveMade?.length && (
        <div>
          <h2 className="text-x1 md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings you have made
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-2 x1:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((bookingflight) => (
              <MyBookingsFlightClient
                key={bookingflight.id}
                bookingflight={bookingflight}
              />
            ))}
          </div>
        </div>
      )}

      {!!bookingsFromVisitors?.length && (
        <div>
          <h2 className="text-x1 md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings visitors have made on your properties
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-2 x1:grid-cols-3 gap-6">
            {bookingsFromVisitors.map((bookingflight) => (
              <MyBookingsFlightClient
                key={bookingflight.id}
                bookingflight={bookingflight}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingFlights;
