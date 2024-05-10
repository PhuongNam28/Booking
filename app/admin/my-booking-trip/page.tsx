"use client";
import apiClient from "@/lib/api-client";
import { TripBookings, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<TripBookings[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_ALL_BOOK_TRIP);
      if (response.data.bookingtrip) setData(response.data.bookingtrip);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
