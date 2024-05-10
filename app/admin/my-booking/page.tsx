"use client";
import apiClient from "@/lib/api-client";
import { Bookings, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import prismadb from "@/lib/prismadb";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<Bookings[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_ALL_BOOKINGS);
      if (response.data.bookings) setData(response.data.bookings);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
