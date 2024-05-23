import Image from "next/image";

interface IProps {
  imageUrl: string;
  title: string;
  amount: string;
  duration: string;
  highlighted: boolean;
}

function DestinationCard({
  imageUrl,
  title,
  amount,
  duration,
  highlighted,
}: IProps) {
  return (
    <div className="flex relative flex-col justify-between pb-[2.63rem] group">
      <div className="object-fill">
        <Image
          src={imageUrl}
          alt="destination image"
          width={314}
          height={514} // Adjust the height as per your requirement
          className="object-cover rounded-t-[1.5rem]"
        />
      </div>
      <div className="bg-white w-full mt-[1.69rem] px-[1.62rem] group-hover:shadow-md pb-[2rem] group-hover:rounded-[1.5rem]">
        <div className="flex justify-between text-lightGray text-[1.125rem] font-bold">
          <p>{title}</p>
          <p>{amount}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <Image
              src="/images/send-icon.png"
              alt="send icon"
              width={24}
              height={24}
            />{" "}
            {/* Adjust width and height as per your image */}
          </div>
          <p className="text-lightGray font-bold">{duration}</p>
        </div>
      </div>
      {highlighted && (
        <div className="absolute bottom-[5rem] right-[-4rem] -z-10 hidden md:block">
          <Image
            src="/images/stylish-ring.png"
            alt="curly ring"
            width={100}
            height={100}
          />{" "}
          {/* Adjust width and height as per your image */}
        </div>
      )}
    </div>
  );
}

export default DestinationCard;
