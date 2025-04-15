// components/professional/ReviewCard.jsx
import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  // Renderizar estrelas com base na avaliação
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={14} 
        className={`${
          index < rating 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"
        }`} 
      />
    ));
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{review.user}</div>
        <div className="text-xs text-gray-500">{review.date}</div>
      </div>
      
      <div className="flex mb-2">
        {renderStars(review.rating)}
      </div>
      
      <p className="text-sm text-gray-700">
        {review.comment}
      </p>
    </div>
  );
}