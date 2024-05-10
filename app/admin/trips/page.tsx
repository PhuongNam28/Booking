"use client";
import apiClient from "@/lib/api-client";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trips, columns } from "./columns";

export default function Page() {
  const [data, setData] = useState<Trips[]>([]);
  const router = useRouter();

  const handleAddTrip = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/trip/new");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_ALL_TRIPS);
      if (response.data.trips) setData(response.data.trips);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hotel List</h1>
        <Button onClick={handleAddTrip}>Add Trip</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
