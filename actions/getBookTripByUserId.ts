import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb"

export const getBookTripByUserId = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings = await prismadb.bookingTrip.findMany({
            where: {
                userId,
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