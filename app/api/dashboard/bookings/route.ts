import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const bookingData = await prismadb.booking.findMany({
            select: {
                userName: true,
                userEmail: true,
                totalPrice: true
            }
        });

        return NextResponse.json(
            {
                bookings: bookingData
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error at /api/dashboard/bookings', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
