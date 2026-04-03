import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { useState } from "react";

function Stars() {
  const [rating, setRating] = useState(3);

  return (
    <div className="App">
      <Button variant="contained">Hello world</Button>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Rating
          name="customized-10"
          max={10}
          value={rating}
          onChange={(event, newValue) => {
            console.log(`Rating is ${newValue}`);
            setRating(newValue);
          }}
        />
        <span style={{ fontWeight: "bold" }}>{rating}</span>{" "}
        {/* 👈 numeric value displayed here */}
      </div>
    </div>
  );
}

export default Stars;
