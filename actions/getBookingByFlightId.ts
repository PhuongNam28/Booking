import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb"
export const getBookingByFlightId = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings = await prismadb.bookingFlight.findMany({
            where: {
                flightOwnerId: userId
            },
            include: {
                Type: true,
                Flight: true
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