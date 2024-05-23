import Image from "next/image";
import React from "react";

function LogoGroupSection() {
  return (
    <div className="w-full flex justify-center">
      <Image
        src="/images/logo-group.png"
        alt="logo group"
        width={1200}
        height={400}
      />
    </div>
  );
}

export default LogoGroupSection;
