import Rating from "@mui/material/Rating";
import { useState } from "react";

function Stars() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(-1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Rating
        name="customized-10"
        max={10}
        value={rating}
        size="large"
        onChange={(event, newValue) => {
          console.log(`Rating is ${newValue}`);
          setRating(newValue);
        }}
        onChangeActive={(event, newValue) => {
          console.log(`Rating is ${newValue}`);
          setHoverRating(newValue);
        }}
      />
      <span style={{ fontWeight: "bold" }}>
        {" "}
        {hoverRating !== -1 ? hoverRating : rating}
      </span>{" "}
      {/* 👈 numeric value displayed here */}
    </div>
  );
}

export default Stars;
