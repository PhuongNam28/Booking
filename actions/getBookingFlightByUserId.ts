import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb"

export const getBookingFlightByUserId = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings = await prismadb.bookingFlight.findMany({
            where: {
                userId,
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