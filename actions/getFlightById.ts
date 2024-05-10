import prismadb from "@/lib/prismadb"

export const getFlightById = async(flightId: string) => {
    try{
        const flight = await prismadb.flight.findUnique({
            where: {
                id: flightId,
            },
            include: {
                types: true,
            }
        });

        if(!flight) return null;

        return flight;

    } catch(error: any){
        throw new Error(error)
    }

};