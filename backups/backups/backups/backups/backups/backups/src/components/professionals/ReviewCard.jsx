import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Função para converter a data do formato ISO para data formatada
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Renderiza as estrelas com base na avaliação
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={14} 
          className={`${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };
  
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{review.user}</div>
          <div className="flex items-center mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(review.date)}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mt-3">
        {review.comment}
      </p>
    </div>
  );
}