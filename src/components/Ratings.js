import * as React from 'react';
import Rating from '@mui/material/Rating';

const getRandomRating = () => {
  // Generate a random number between 0 and 5
  return Math.random() * 5;
};

export default function TextRating() {
  const value = getRandomRating();

  return (
    <div>
      <Rating
        name="text-feedback"
        value={value}
        readOnly
        precision={0.5}
        sx={{ fontSize: 20 }} // Adjust the fontSize as needed
      />
    </div>
  );
}
