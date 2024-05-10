import { getBookTripByUserId } from "@/actions/getBookTripByUserId";
import { getBookingByTripId } from "@/actions/getBookingByTripId";
import MyBookingsTripClient from "@/components/bookingtrip/MyBookingsTripClient";

const MyBookingTrips = async () => {
  const bookingsFromVisitors = await getBookingByTripId();
  const bookingsIHaveMade = await getBookTripByUserId();
  if (!bookingsFromVisitors && !bookingsIHaveMade)
    return <div>No bookings found</div>;
  return (
    <div className="flex flex-col gap-10">
      {!!bookingsIHaveMade?.length && (
        <div>
          <h2 className="text-x1 md:text-2xl font-semibold mb-6 mt-2">
            Here are bookings you have made
          </h2>

          <div className=" grid grid-cols-1 md:grid-cols-2 x1:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((bookingtrip) => (
              <MyBookingsTripClient
                key={bookingtrip.id}
                bookingtrip={bookingtrip}
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
            {bookingsFromVisitors.map((bookingtrip) => (
              <MyBookingsTripClient
                key={bookingtrip.id}
                bookingtrip={bookingtrip}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingTrips;
