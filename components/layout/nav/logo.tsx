import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div>
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <div className="font-bold text-xl ml-2">PalmTree</div>
      </Link>
    </div>
  );
};

export default Logo;
