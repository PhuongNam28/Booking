import React from "react";
import Image from "next/image";
import classNames from "classnames";

interface IProps {
  iconUrl: string;
  title: string;
  description: string;
  highlighted: boolean;
}

function CategoryCard({ iconUrl, title, description, highlighted }: IProps) {
  return (
    <div
      className={classNames(
        "flex relative flex-col gap-4 items-center p-[2.5rem]",
        {
          "bg-white shadow-md rounded-[2.5rem]": highlighted,
        }
      )}
    >
      <div>
        <Image src={iconUrl} alt="category card icon" width={80} height={80} />
      </div>
      <p className="text-subtitle text-[1.2rem] font-[600]">{title}</p>
      <p className="text-lightGray text-[1rem] font-bold">{description}</p>
      {highlighted && (
        <div className="absolute -bottom-8 -left-10 -z-10">
          <Image
            src="/images/rectangle-shape.png"
            alt="rectangle shape"
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
}

export default CategoryCard;
