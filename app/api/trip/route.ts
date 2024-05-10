import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(reg: Request){
    try{
        const body = await reg.json();
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const trip = await prismadb.trip.create({
            data: {
                ...body,
                userId
            }
        })
        return NextResponse.json(trip);
    } catch(error){
        console.log('Error at /api/trip POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

async function formatDate(date: Date): Promise<string> {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
}
  
export async function GET(){
      try {
          const {userId} = auth();
  
          if(!userId){
              return new NextResponse('Unauthorized', {status: 401})
          }
  
          const trips = await prismadb.trip.findMany({
          });
  
          // Chuyển đổi kiểu dữ liệu của startDate và endDate từ chuỗi sang Date
          const formattedTrips = await Promise.all(trips.map(async (trip) => ({
            ...trip,
            addedAt: await formatDate(trip.addedAt),
            updatedAt: await formatDate(trip.updatedAt),
          })));
  
          if (formattedTrips.length > 0) {
              return NextResponse.json(
                  {
                      trips: formattedTrips,
                  },
                  { status: 200 }
              );
          } else {
              return NextResponse.json({ msg: "No Trip found." }, { status: 404 });
          }
          
      } catch (error) {
          console.log('Error at /api/trip/', error)
          return new NextResponse('Internal Server Error', {status: 500})
      }
  }