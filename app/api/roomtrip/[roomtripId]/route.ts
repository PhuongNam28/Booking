import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {roomtripId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.roomtripId){
            return new NextResponse('Roomtrip Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const roomtrip = await prismadb.roomTrip.update({
            where:{
                id: params.roomtripId,
            },
            data: {...body},
        });
        return NextResponse.json(roomtrip);
    } catch (error) {
        console.log('Error at /api/roomtrip/roomtripId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {roomtripId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.roomtripId){
            return new NextResponse('Roomtrip Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const roomtrip = await prismadb.roomTrip.delete({
            where:{
                id: params.roomtripId,
            },
        });
        return NextResponse.json(roomtrip);
    } catch (error) {
        console.log('Error at /api/roomtrip/roomtripId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}