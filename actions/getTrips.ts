import prismadb from "@/lib/prismadb";

export const getTrips = async (searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
})=>{
    try{
        const{title, country, state,city} = searchParams;
        const trips = await prismadb.trip.findMany({
            where:{
                title:{
                    contains: title,
                },
                country,
                state,
                city,
            },
            include: {roomtrips: true},
        })
        return trips;
    }catch(error: any){
        console.log(error);
        throw new Error(error)
    }
}