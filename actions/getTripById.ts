import prismadb from "@/lib/prismadb"

export const getTripById = async(tripId: string) => {
    try{
        const trip = await prismadb.trip.findUnique({
            where: {
                id: tripId,
            },include: {
                roomtrips: true,
            }
        });

        if(!trip) return null;

        return trip;

    } catch(error: any){
        throw new Error(error)
    }

};