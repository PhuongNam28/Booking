import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16'
})

export async function POST(reg: Request){
    const user = await currentUser();

    if(!user)
    {
        return new NextResponse('Unauthorized', {status: 401})

    }

    const body = await reg.json();
    const {bookingtrip, payment_intent_id} = body;

    const bookingData = {
        ...bookingtrip,
        userName: user.firstName,
        userEmail: user.emailAddresses[0].emailAddress,
        userId: user.id,
        currency: 'usd',
        paymentIntentId: payment_intent_id,
    }

    let foundBooking;

    if(payment_intent_id)
    {
        foundBooking = await prismadb.bookingTrip.findUnique({
            where: {paymentIntentId: payment_intent_id, userId: user.id}
        })
    }

    if(foundBooking && payment_intent_id)
    {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)

        if(current_intent){
            const update_intent = await stripe.paymentIntents.update(payment_intent_id,{
                amount: bookingtrip.totalPrice * 100
            })

            const res = await prismadb.bookingTrip.update({
                where: {paymentIntentId: payment_intent_id, userId: user.id},
                data: bookingData
            })

            const updatedAvailableSeats = bookingtrip.availableSeats - bookingtrip.member;
        await prismadb.roomTrip.update({
            where: { id: bookingtrip.roomtripId },
            data: {
                availableSeats: updatedAvailableSeats
            }
        }); 

            if(!res){
                return NextResponse.error()
            }
            return NextResponse.json({paymentIntent: update_intent})
        }
    }else{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: bookingtrip.totalPrice * 100,
            currency: bookingData.currency,
            automatic_payment_methods: {enabled: true}
        })

        bookingData.paymentIntentId = paymentIntent.id;

        await prismadb.bookingTrip.create({
            data: bookingData
        })

        const updatedAvailableSeats = bookingtrip.availableSeats - bookingtrip.member;
        await prismadb.roomTrip.update({
            where: { id: bookingtrip.roomtripId },
            data: {
                availableSeats: updatedAvailableSeats
            }
        }); 

        return NextResponse.json({paymentIntent})
    }

    return new NextResponse('Internal Server Error', {status: 500})
}