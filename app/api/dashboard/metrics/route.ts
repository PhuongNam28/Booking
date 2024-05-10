import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

    
    const hotels = await prismadb.hotel.count();
    const trips = await prismadb.trip.count();
    const bookingtrips = await prismadb.bookingTrip.count();
    const bookings = await prismadb.booking.count();
    const roomtrips = await prismadb.roomTrip.count();
    const room = await prismadb.room.count();
    
    let totalPrice_booking = null; // Khởi tạo totalPrice cho booking là null
        let totalPrice_bookingTrip = null; // Khởi tạo totalPrice cho bookingTrip là null
        
        // Truy vấn aggregate để tính tổng totalPrice cho booking
        const totalPriceResult_booking = await prismadb.booking.aggregate({
            _sum: {
                totalPrice: true
            }
        });

        // Kiểm tra xem có tồn tại giá trị totalPrice trong kết quả của truy vấn không
        if (totalPriceResult_booking && totalPriceResult_booking._sum && totalPriceResult_booking._sum.totalPrice) {
            totalPrice_booking = totalPriceResult_booking._sum.totalPrice;
        }

        // Truy vấn aggregate để tính tổng totalPrice cho bookingTrip
        const totalPriceResult_bookingTrip = await prismadb.bookingTrip.aggregate({
            _sum: {
                totalPrice: true
            }
        });

        // Kiểm tra xem có tồn tại giá trị totalPrice trong kết quả của truy vấn không
        if (totalPriceResult_bookingTrip && totalPriceResult_bookingTrip._sum && totalPriceResult_bookingTrip._sum.totalPrice) {
            totalPrice_bookingTrip = totalPriceResult_bookingTrip._sum.totalPrice;
        }

        const totalPriceResult_bookingFlight = await prismadb.bookingFlight.aggregate({
            _sum: {
                totalPrice: true
            }
        });
        
        let totalPrice_bookingFlight = null; // Khởi tạo totalPrice cho bookingFlight là null
        
        // Kiểm tra xem có tồn tại giá trị totalPrice trong kết quả của truy vấn không
        let total = 0; // Khai báo biến total ở phạm vi bên ngoài

if (totalPriceResult_bookingFlight && totalPriceResult_bookingFlight._sum && totalPriceResult_bookingFlight._sum.totalPrice) {
    totalPrice_bookingFlight = totalPriceResult_bookingFlight._sum.totalPrice;
}
if (totalPrice_booking !== null && totalPrice_bookingTrip !== null && totalPrice_bookingFlight !== null) {
    total = totalPrice_bookingFlight + totalPrice_booking + totalPrice_bookingTrip; // Gán giá trị cho biến total
}
        

    return NextResponse.json(
      {
        hotels,
        trips,
        bookingtrips,
        bookings,
        totalPrice_booking,
        totalPrice_bookingTrip,
        totalPrice_bookingFlight,
        roomtrips,
        room,
        total,
      },
      { status: 200 }
    );
    } catch (error) {
        console.log('Error at /api/dashboard/metrics', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
