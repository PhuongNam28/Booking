import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { ADMIN_API_ROUTES } from "@/ultis/api-route";

export type SalesProps = {
  userName: string;
  userEmail: string;
  totalPrice: number;
};

type SalesCardProps = {
  onSalesDataChange: (salesData: SalesProps[]) => void;
};

const SalesCard = ({ onSalesDataChange }: SalesCardProps) => {
  const [data, setData] = useState<SalesProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ADMIN_API_ROUTES.DASHBOARD_BOOKINGS);
        const data = await response.json();
        console.log("Response from API:", data);
        if (data.bookingData) {
          setData(data.bookingData);
          onSalesDataChange(data.bookingData); // Gọi hàm callback để truyền dữ liệu ra ngoài
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [onSalesDataChange]);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="flex flex-wrap justify-between gap-3">
          <section className="flex justify-between gap-3">
            <div className="text-sm">
              <p>{item.userName}</p>
              <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
                {item.userEmail}
              </div>
            </div>
          </section>
          <p>{item.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default SalesCard;
