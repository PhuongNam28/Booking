import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs";

export const getHotelByUserID = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const hotels = await prismadb.hotel.findMany({
            where: {
                userId: userId
            },
            include: {
                rooms: true,
            }
        });

        if(!hotels) return null;

        return hotels;

    } catch(error: any){
        throw new Error(error)
    }

};