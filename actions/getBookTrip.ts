import prismadb from "@/lib/prismadb";

export const getBookTrip = async(tripId: string) =>{
    try{
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const bookings = await prismadb.bookingTrip.findMany({
            where: {
                tripId,
            }
        })

        return bookings;
    }catch(error:any){
        console.log(error);
        throw new Error(error)
        
    }
}