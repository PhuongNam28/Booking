import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="max-w-[1920px] w-full mx-auto x1:px-20 px-4 py-4">
      {children}
    </div>
  );
};

export default Container;
