import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import {SignJWT} from "jose"
import { cookies } from "next/headers"
import { auth } from "@clerk/nextjs";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.JWT_KEY as string)
const createToken = async (email: string, userID: number) =>{
    return await new SignJWT({email,userID,isAdmin:true}).setProtectedHeader({alg}).setExpirationTime("48h").sign(secret);
}

export async function POST(request: Request) {
    try{
        const {email,password} = await request.json();
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!email || !password) {
            return NextResponse.json({message: "Email and Password is required"}, {status: 400})
        }

        const user = await prismadb.admin.findUnique({
            where: {email,password}
        });

        if(!user){
            return NextResponse.json({message: "Invalid Email and Password"}, {status: 404})
        }else{
            const token = await createToken(user.email, user.id);
            cookies().set("access_token",token);

            return NextResponse.json({
                userInfo: {
                    id: user.id,
                    email: user.email,
                }
            })
        }
    }catch(error){
        return NextResponse.json('An unexpected error occured', {status: 500})
    }
}