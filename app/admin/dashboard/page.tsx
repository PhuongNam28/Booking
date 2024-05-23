"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { ADMIN_API_ROUTES } from "@/ultis/api-route";
import { Metrics } from "./components/metrics";
import { ScrapingChart } from "./components/charts";
import SalesCard, { SalesProps } from "@/components/SalesCard";
import { CardContent } from "@/components/CardProps";

const Dashboard = () => {
  const [trips, setTrips] = useState(0);
  const [bookingtrips, setBookingtrips] = useState(0);
  const [hotels, setHotels] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [room, setRoom] = useState(0);
  const [roomtrips, setRoomtrips] = useState(0);
  const [totalPrice_booking, setTotalPrice_booking] = useState(0);
  const [totalPrice_bookingTrip, setTotalPrice_bookingTrip] = useState(0);
  const [totalPrice_bookingFlight, setTotalPrice_bookingFlight] = useState(0);
  const [total, setTotal] = useState(0);
  const [salesData, setSalesData] = useState<SalesProps[]>([]);

  const uesrSalesData: SalesProps[] = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      saleAmount: "+$1,999.00",
    },
    {
      name: "Jackson Lee",
      email: "isabella.nguyen@email.com",
      saleAmount: "+$1,999.00",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      saleAmount: "+$39.00",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      saleAmount: "+$299.00",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      saleAmount: "+$39.00",
    },
  ];

  const handleSalesDataChange = (data: SalesProps[]) => {
    setSalesData(data);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(ADMIN_API_ROUTES.DASHBOARD);
      console.log({ response });
      setTrips(response.data.trips);
      setBookingtrips(response.data.bookingtrips);
      setHotels(response.data.hotels);
      setBookings(response.data.bookings);
      setRoom(response.data.room);
      setRoomtrips(response.data.roomtrips);
      setTotalPrice_booking(response.data.totalPrice_booking);
      setTotalPrice_bookingTrip(response.data.totalPrice_bookingTrip);
      setTotalPrice_bookingFlight(response.data.totalPrice_bookingFlight);
      setTotal(response.data.total);
    };
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-5  w-full">
      <section className="m-10 flex flex-col gap-10">
        <section className="grid grid-cols-4 gap-4">
          <Metrics title="Sales Amount (Hotel)" value={totalPrice_booking} />
          <Metrics
            title="Sales Amount (Trips)"
            value={totalPrice_bookingTrip}
          />
          <Metrics
            title="Sales Amount (Flights)"
            value={totalPrice_bookingFlight}
          />
          <Metrics title="Sales Amount (Total)" value={total} />
        </section>
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <ScrapingChart />
        </CardContent>

        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made 265 sales this month.
            </p>
          </section>
          {uesrSalesData.map((d, i) => (
            <SalesCard
              key={i}
              email={d.email}
              name={d.name}
              saleAmount={d.saleAmount}
            />
          ))}
        </CardContent>
      </section>
    </div>
  );
};

export default Dashboard;
