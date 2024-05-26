// HotelList.tsx
"use client";
import { HotelWithRooms } from "./AddHotelForm";
import HotelCard from "./HotelCard";
import { useState } from "react";
import { Button } from "../ui/button";
import SearchHotel from "./SearchHotel";

const HotelList = ({ hotels }: { hotels: HotelWithRooms[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 9; // Số lượng khách sạn hiển thị trên mỗi trang

  // Tính chỉ số của khách sạn đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // Hàm chuyển đến trang trước hoặc sau
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <SearchHotel />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
        {currentHotels.map((hotel) => (
          <div key={hotel.id}>
            <HotelCard hotel={hotel} />
          </div>
        ))}

        {/* Hiển thị nút điều hướng phân trang */}
        <div className="col-span-full flex justify-between mt-4">
          <Button
            type="button"
            onClick={prevPage}
            variant="outline"
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Previous Page
          </Button>
          <Button
            type="button"
            onClick={nextPage}
            variant="ghost"
            disabled={currentHotels.length < hotelsPerPage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            Next Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
