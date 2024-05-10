import prismadb from "@/lib/prismadb";

export const getBookFlight = async(flightId: string) =>{
    try{

        const bookings = await prismadb.bookingFlight.findMany({
            where: {
                flightId,
            }
        })

        return bookings;
    }catch(error:any){
        console.log(error);
        throw new Error(error)
        
    }
}