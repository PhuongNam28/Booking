import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {id: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.id){
            return new NextResponse('Comment Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const comment = await prismadb.comment.update({
            where:{
                id: params.id,
            },
            data: {...body},
        });
        return NextResponse.json(comment);
    } catch (error) {
        console.log('Error at /api/comment/commentId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {id: string}}){
    try {
        
        const {userId} = auth();

        if(!params.id){
            return new NextResponse('Comment Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const comment_d = await prismadb.comment.delete({
            where:{
                id: params.id,
            },
        });
        return NextResponse.json(comment_d);
    } catch (error) {
        console.log('Error at /api/comment/commentId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}