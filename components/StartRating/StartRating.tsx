import { useState } from "react";

interface StarRatingProps {
  value: number; // Định rõ kiểu dữ liệu của value là number
  onChange: (value: number) => void; // Hàm callback nhận vào một tham số kiểu number
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number>(value); // Định rõ kiểu dữ liệu của hoverValue là number

  const handleMouseOver = (newValue: number) => {
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(value);
  };

  const handleClick = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          style={{
            cursor: "pointer",
            color: index <= (hoverValue || value) ? "#FFD700" : "#C0C0C0",
          }}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
