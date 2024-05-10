import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {Id: string}}){
    try {
        const {userId} = auth();

        if(!params.Id){
            return new NextResponse('Payment Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const booking = await prismadb.bookingTrip.update({
            where:{
                paymentIntentId: params.Id,
            },
            data: { paymentStatus: true},
        });
        return NextResponse.json(booking);
    } catch (error) {
        console.log('Error at /api/bookingtrip/Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {Id: string}}){
    try {
        
        const {userId} = auth();

        if(!params.Id){
            return new NextResponse('Booking Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const booking = await prismadb.bookingTrip.delete({
            where:{
                id: params.Id,
            },
        });
        return NextResponse.json(booking);
    } catch (error) {
        console.log('Error at /api/bookingtrip/Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET(reg: Request, {params}: {params: {Id: string}}){
    try {
        
        const {userId} = auth();

        if(!params.Id){
            return new NextResponse('Hotel Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1)



        const bookings = await prismadb.bookingTrip.findMany({
            where:{
                paymentStatus: true,
                roomtripId: params.Id,
            },
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.log('Error at /api/bookingtrip/Id GET', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}