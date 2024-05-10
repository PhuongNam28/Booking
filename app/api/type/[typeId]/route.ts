import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {typeId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.typeId){
            return new NextResponse('type Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const type = await prismadb.typeFlight.update({
            where:{
                id: params.typeId,
            },
            data: {...body},
        });
        return NextResponse.json(type);
    } catch (error) {
        console.log('Error at /api/type/typeId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {typeId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.typeId){
            return new NextResponse('type Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const type = await prismadb.typeFlight.delete({
            where:{
                id: params.typeId,
            },
        });
        return NextResponse.json(type);
    } catch (error) {
        console.log('Error at /api/type/typeId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}