import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {destiId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.destiId){
            return new NextResponse('include Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const include = await prismadb.destination.update({
            where:{
                id: params.destiId,
            },
            data: {...body},
        });
        return NextResponse.json(include);
    } catch (error) {
        console.log('Error at /api/desti/destiId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {destiId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.destiId){
            return new NextResponse('includeId Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const include = await prismadb.destination.delete({
            where:{
                id: params.destiId,
            },
        });
        return NextResponse.json(include);
    } catch (error) {
        console.log('Error at /api/desti/destiId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}