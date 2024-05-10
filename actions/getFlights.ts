import prismadb from "@/lib/prismadb";

export const getFlights = async (searchParams: {
    name: string;
    fromCountry: string;
    
})=>{
    try{
        const{name, fromCountry} = searchParams;
        const flights = await prismadb.flight.findMany({
            where:{
                name:{
                    contains: name,
                },
                fromCountry,
                
            },
            include: {types: true},
        })
        return flights;
    }catch(error: any){
        console.log(error);
        throw new Error(error)
    }
}