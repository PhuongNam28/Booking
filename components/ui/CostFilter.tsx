import React, { useState, useEffect } from "react";
import qs from "query-string";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";
import { prismadb } from "@/lib";
import "rc-slider/assets/index.css";

const PriceFilter = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]); // Sử dụng một mảng để đại diện cho khoảng giá

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        let currentQuery = {};
        if (params) {
          currentQuery = qs.parse(params.toString());
        }
        const url = qs.stringifyUrl(
          {
            url: "/",
            query: currentQuery,
          },
          { skipNull: true, skipEmptyString: true }
        );
        router.push(url);

        const result = await prismadb.room.findMany({
          where: {
            roomPrice: {
              gte: priceRange[0], // Sử dụng priceRange[0] là giá thấp nhất và priceRange[1] là giá cao nhất
              lte: priceRange[1],
            },
          },
        });
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    //eslint-disable-next-line
  }, [priceRange, params, router]);

  const handleClear = () => {
    router.push("/");
    setPriceRange([0, 1000]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Price Range</h2>
      <div className="flex items-center">
        <div className="w-4/5 mr-4">
          <Slider
            min={0}
            max={1000}
            value={priceRange}
            onChange={(newPriceRange) => {
              if (Array.isArray(newPriceRange)) {
                setPriceRange(newPriceRange);
              }
            }}
          />
        </div>
        <div className="w-1/5">
          <Button
            onClick={handleClear}
            variant="outline"
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <span className="text-gray-600 text-sm">${priceRange[0]}</span>
        <span className="text-gray-600 text-sm">${priceRange[1]}</span>
      </div>
    </div>
  );
};

export default PriceFilter;
