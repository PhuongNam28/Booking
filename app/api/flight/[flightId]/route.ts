import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {flightId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.flightId){
            return new NextResponse('Flight Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const flight = await prismadb.flight.update({
            where:{
                id: params.flightId,
            },
            data: {...body},
        });
        return NextResponse.json(flight);
    } catch (error) {
        console.log('Error at /api/flight/flightId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {flightId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.flightId){
            return new NextResponse('flight Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const flight = await prismadb.flight.delete({
            where:{
                id: params.flightId,
            },
        });
        return NextResponse.json(flight);
    } catch (error) {
        console.log('Error at /api/flight/flightId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}