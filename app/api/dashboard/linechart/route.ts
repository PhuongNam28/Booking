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

    const startDate = startOfDay(
        // @ts-ignore
        new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
      );
    const endDate = endOfDay(new Date());

    // Truy vấn aggregate để tính tổng totalPrice cho booking
    const hotels = await prismadb.booking.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        bookedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Truy vấn aggregate để tính tổng totalPrice cho bookingTrip
    const trips = await prismadb.bookingTrip.aggregate({
      _sum: {
        totalPrice: true
      },
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
        trips
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error at /api/dashboard/linechart', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
