import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image src="/logo.svg" alt="logo" width={30} height={30} />
      <div className="font-bold text-xl">PalmTree</div>
    </div>
  );
};

export default Logo;
