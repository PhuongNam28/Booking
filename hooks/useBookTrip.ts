import { RoomTrip } from '@prisma/client';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface BookRoomStore{
    bookingRoomData: RoomDataType | null;
    paymentIntentId: string | null;
    clientSecret: string | undefined;
    setRoomData: (data: RoomDataType) => void;
    setPaymentIntentId: (paymentIntentId: string) => void;
    setClientSecret: (clientSecret: string) => void;
    resetBookRoom: () => void
}

type RoomDataType = {
    roomtrip: RoomTrip;
    totalPrice: number;
    breakFastIncluded: boolean;
    member: number,
    
}
const useBookTrip = create<BookRoomStore>()(
    persist((set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
  
      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },
  
      setClientSecret: (clientSecret: string) => {
        set({ clientSecret });
      },
      
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          paymentIntentId: null,
          clientSecret: undefined,
        });
      }
    }), {
      name: 'Bookroomtrip'
    })
  );
  

export default useBookTrip;
