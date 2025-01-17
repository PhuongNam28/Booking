import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb"

export const getBookingsByHotelOwnerID = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const bookings = await prismadb.booking.findMany({
            where: {
                hotelOwnerId: userId
            },
            include: {
                Room: true,
                Hotel: true
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