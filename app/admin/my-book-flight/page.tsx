"use client";
import apiClient from "@/lib/api-client";
import { FlightBookings, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<FlightBookings[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_BOOK_FLIGHT);
      if (response.data.bookingflight) setData(response.data.bookingflight);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
