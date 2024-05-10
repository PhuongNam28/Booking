
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
    // Get data for the last 7 days or as per your requirement
    const startDate = startOfDay(
      // @ts-ignore
      new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
    );
    const endDate = endOfDay(new Date());

    const hotels = await prismadb.booking.groupBy({
      by: ["bookedAt"],
      _count: true,
      where: {
        bookedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });


    const trips = await prismadb.bookingTrip.groupBy({
      by: ["bookedAt"],
      _count: true,
      where: {
        bookedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const flights = await prismadb.bookingFlight.groupBy({
      by: ["bookedAt"],
      _count: true,
      where: {
        bookedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return NextResponse.json(
      {
        hotels,
        trips,
        flights,
      },
      { status: 200 }
    );
} catch (error) {
    console.log('Error at /api/dashboard/charts', error);
    return new NextResponse('Internal Server Error', { status: 500 });
}
}
