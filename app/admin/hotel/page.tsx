"use client";
import apiClient from "@/lib/api-client";
import { Hotels, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [data, setData] = useState<Hotels[]>([]);
  const router = useRouter();

  const handleAddHotel = () => {
    // Chuyển hướng đến trang "hotel/new"
    router.push("/hotel/new");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(USER_API_ROUTES.GET_ALL_HOTELS);
      if (response.data.hotels) setData(response.data.hotels);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hotel List</h1>
        <Button onClick={handleAddHotel}>Add Hotel</Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
