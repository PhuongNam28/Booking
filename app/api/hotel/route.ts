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

        const hotel = await prismadb.hotel.create({
            data: {
                ...body,
                userId
            }
        })
        return NextResponse.json(hotel);
    } catch(error){
        console.log('Error at /api/hotel POST', error)
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
  
          const hotels = await prismadb.hotel.findMany({
          });
  
          // Chuyển đổi kiểu dữ liệu của startDate và endDate từ chuỗi sang Date
          const formattedHotels = await Promise.all(hotels.map(async (hotel) => ({
            ...hotel,
            addedAt: await formatDate(hotel.addedAt),
            updatedAt: await formatDate(hotel.updatedAt),
          })));
  
          if (formattedHotels.length > 0) {
              return NextResponse.json(
                  {
                      hotels: formattedHotels,
                  },
                  { status: 200 }
              );
          } else {
              return NextResponse.json({ msg: "No Hotels found." }, { status: 404 });
          }
          
      } catch (error) {
          console.log('Error at /api/hotel/', error)
          return new NextResponse('Internal Server Error', {status: 500})
      }
  }