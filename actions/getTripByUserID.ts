import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs";

export const getTripByUserID = async() => {
    try{
        const {userId} = auth();

        if(!userId){
            throw new Error('Unauthorized')
        }

        const trips = await prismadb.trip.findMany({
            where: {
                userId: userId
            },
            include: {
                roomtrips: true,
            }
        });

        if(!trips) return null;

        return trips;

    } catch(error: any){
        throw new Error(error)
    }

};