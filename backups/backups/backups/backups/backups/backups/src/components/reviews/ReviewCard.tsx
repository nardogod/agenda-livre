// src/components/reviews/ReviewCard.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {review.clientName.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium">{review.clientName}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i}
              size={14}
              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
      {review.serviceName && (
        <p className="text-xs text-purple-600 mt-1">
          Serviço: {review.serviceName}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;