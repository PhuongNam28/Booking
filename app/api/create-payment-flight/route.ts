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
    const { bookingFlight, payment_intent_id} = body;



    // Tạo booking
    const bookingData = {
        ...bookingFlight,
        userName: user.firstName,
        userEmail: user.emailAddresses[0].emailAddress,
        userId: user.id,
        currency: 'usd',
        paymentIntentId: payment_intent_id,
        
    };

    // Tạo payment intent và booking
    try {
        let foundBooking;
        if (payment_intent_id) {
            foundBooking = await prismadb.bookingFlight.findUnique({
                where: { paymentIntentId: payment_intent_id, userId: user.id }
            });
        }

        if (foundBooking && payment_intent_id) {
            const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

            if (current_intent) {
                const update_intent = await stripe.paymentIntents.update(payment_intent_id, {
                    amount: bookingFlight.totalPrice * 100
                });

                // Cập nhật thông tin bookingFlight
                const updatedBooking = await prismadb.bookingFlight.update({
                    where: { paymentIntentId: payment_intent_id, userId: user.id },
                    data: bookingData
                });

                if (!updatedBooking) {
                    return NextResponse.error();
                }

                // Cập nhật thông tin typeFlight
                const updatedAvailableSeats = bookingFlight.availableSeats - (bookingFlight.adultCount + bookingFlight.childrenCount);
                await prismadb.typeFlight.update({
                    where: { id: bookingFlight.typeFlightId },
                    data: {
                        availableSeats: updatedAvailableSeats
                    }
                });

                return NextResponse.json({ paymentIntent: update_intent });
            }
        } else {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: bookingFlight.totalPrice * 100,
                currency: bookingData.currency,
                automatic_payment_methods: { enabled: true }
            });

            bookingData.paymentIntentId = paymentIntent.id;

            await prismadb.bookingFlight.create({
                data: bookingData
            });

            // Cập nhật thông tin typeFlight
            const updatedAvailableSeats = bookingFlight.availableSeats - (bookingFlight.adultCount + bookingFlight.childrenCount);
            await prismadb.typeFlight.update({
                where: { id: bookingFlight.typeFlightId },
                data: {
                    availableSeats: updatedAvailableSeats
                }
            });

            return NextResponse.json({ paymentIntent });
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}