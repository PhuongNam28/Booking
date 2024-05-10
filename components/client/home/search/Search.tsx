import Image from "next/image";
import React from "react";

const SearchHome = () => {
  const activities = [
    { name: "Sea & Sailing", icon: "/home/ship.svg" },
    { name: "Sea & Sailing", icon: "/home/biking.svg" },
    { name: "Sea & Sailing", icon: "/home/trolley-bag.svg" },
    { name: "Sea & Sailing", icon: "/home/motor-boat.svg" },
    { name: "Sea & Sailing", icon: "/home/cedar.svg" },
  ];
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-xl font-bold max-w-[100%]">
          {" "}
          {/* Sử dụng max-width để giới hạn chiều rộng */}
          Best Tours made for you in mind!
        </h3>
      </div>
      {/* Render other content (activities) here */}
    </div>
  );
};

export default SearchHome;
