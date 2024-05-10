import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {tripId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.tripId){
            return new NextResponse('Trip Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const trip = await prismadb.trip.update({
            where:{
                id: params.tripId,
            },
            data: {...body},
        });
        return NextResponse.json(trip);
    } catch (error) {
        console.log('Error at /api/trip/tripId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {tripId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.tripId){
            return new NextResponse('Trip Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const trip = await prismadb.trip.delete({
            where:{
                id: params.tripId,
            },
        });
        return NextResponse.json(trip);
    } catch (error) {
        console.log('Error at /api/trip/tripId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}