import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(reg: Request){
    try{
        const body = await reg.json();
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const type = await prismadb.typeFlight.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(type);
    } catch(error){
        console.log('Error at /api/type POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}