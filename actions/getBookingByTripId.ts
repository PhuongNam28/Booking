import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb"
export const getBookingByTripId = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings = await prismadb.bookingTrip.findMany({
            where: {
                tripOwnerId: userId
            },
            include: {
                RoomTrip: true,
                Trip: true
            },
            orderBy:{
                bookedAt: "desc"
            }

        });

        if(!bookings) return null;

        return bookings;

        
    }catch(error: any){
        console.log(error);
        throw new Error(error)
    }
}