import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { apiClient } from "@/lib";
import { ADMIN_API_ROUTES } from "@/ultis";

// Define your data types
interface ScrapingData {
  hotels: Array<{ bookedAt: string; _count: number }>;
  trips: Array<{ bookedAt: string; _count: number }>;
  flights: Array<{ bookedAt: string; _count: number }>;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScrapingChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Hotels",
        data: [],
        backgroundColor: "red",
      },
      {
        label: "Trips",
        data: [],
        backgroundColor: "green",
      },
      {
        label: "Flights",
        data: [],
        backgroundColor: "yellow",
      },
    ],
  });

  const processData = (data: ScrapingData): ChartData => {
    const aggregation: {
      [key: string]: { hotels: number; trips: number; flights: number };
    } = {};

    data.hotels.forEach((item) => {
      const date = item.bookedAt.split("T")[0];
      if (!aggregation[date]) {
        aggregation[date] = { hotels: 0, trips: 0, flights: 0 };
      }
      aggregation[date].hotels += item._count;
    });

    data.trips.forEach((item) => {
      const date = item.bookedAt.split("T")[0];
      if (!aggregation[date]) {
        aggregation[date] = { hotels: 0, trips: 0, flights: 0 };
      }
      aggregation[date].trips += item._count;
    });

    data.trips.forEach((item) => {
      const date = item.bookedAt.split("T")[0];
      if (!aggregation[date]) {
        aggregation[date] = { hotels: 0, trips: 0, flights: 0 };
      }
      aggregation[date].flights += item._count;
    });

    const dates = Object.keys(aggregation);
    const hotels = dates.map((date) => aggregation[date].hotels);
    const trips = dates.map((date) => aggregation[date].trips);
    const flights = dates.map((date) => aggregation[date].flights);

    return {
      labels: dates,
      datasets: [
        { label: "Hotels", data: hotels, backgroundColor: "#05f792" },
        { label: "Trips", data: trips, backgroundColor: "#f1226a" },
        { label: "Flights", data: flights, backgroundColor: "#e5ee28" },
      ],
    };
  };

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(
        ADMIN_API_ROUTES.DASHBOARD_SCRAPING_CHART_DATA
      );
      console.log({ response });
      const newData = processData(response.data);
      setChartData(newData);
    };
    getData();
  }, []);

  return (
    <Card className="h-[600px]">
      <CardHeader>Chart Data Total Bookings</CardHeader>
      <CardBody className="flex items-center justify-center">
        <Bar data={chartData} height={600} width={1700} />
      </CardBody>
    </Card>
  );
};

export default dynamic(() => Promise.resolve(ScrapingChart), {
  ssr: false,
});
