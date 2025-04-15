// src/components/reviews/RatingStars.tsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  initialRating = 0,
  onChange,
  readOnly = false,
  size = 20
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    if (readOnly) return;
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`p-1 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => handleRatingChange(star)}
          disabled={readOnly}
          aria-label={`${star} estrelas`}
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// src/components/reviews/ReviewCard.tsx
import React, { useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { Review } from '../../types/professional';
import { formatDate } from '../../utils/formatting';

interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLike }) => {
  const [liked, setLiked] = useState(false);
  
  const handleLike = () => {
    if (onLike && !liked) {
      onLike(review.id);
      setLiked(true);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{review.clientName}</h4>
          <div className="flex items-center mt-1">
            <RatingStars initialRating={review.rating} readOnly size={16} />
            <span className="text-xs text-gray-500 ml-2">
              {formatDate(new Date(review.date))}
            </span>
          </div>
        </div>
        {review.serviceName && (
          <span className="text-xs bg-purple-100 text-purple-600 py-1 px-2 rounded-lg">
            {review.serviceName}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-700 mt-3">{review.comment}</p>
      <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
        <button 
          className={`flex items-center text-xs mr-4 ${liked ? 'text-purple-600' : 'text-gray-500'}`}
          onClick={handleLike}
        >
          <ThumbsUp size={14} className="mr-1" />
          <span>Útil</span>
        </button>
      </div>
    </div>
  );
};

// src/components/reviews/ReviewForm.tsx
import React, { useState } from 'react';
import { RatingStars } from './RatingStars';

interface ReviewFormProps {
  serviceId: string;
  onSubmit: (review: { rating: number; comment: string; serviceId: string }) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor, selecione uma classificação por estrelas');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Seu comentário deve ter pelo menos 10 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({ rating, comment, serviceId });
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl mb-4">
      <h3 className="font-medium mb-3">Deixe sua avaliação</h3>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Classificação</label>
        <RatingStars initialRating={rating} onChange={setRating} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Comentário</label>
        <textarea
          className="w-full p-3 bg-white border border-gray-200 rounded-xl"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este serviço..."
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-xl text-white font-medium ${
          isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
};

// src/components/reviews/ReviewList.tsx
import React from 'react';
import { ReviewCard } from './ReviewCard';
import { Review } from '../../types/professional';

interface ReviewListProps {
  reviews: Review[];
  onLike?: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onLike }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Ainda não há avaliações para este profissional.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Avaliações ({reviews.length})</h3>
        <div className="text-sm text-gray-500">
          Classificação média: 
          <span className="ml-1 font-medium">
            {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
          </span>
        </div>
      </div>
      
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onLike={onLike} />
      ))}
    </div>
  );
};

// src/services/reviews.ts
import api from './api';
import { Review } from '../types/professional';

interface CreateReviewData {
  professionalId: string;
  serviceId: string;
  rating: number;
  comment: string;
}

export const getReviews = async (professionalId: string): Promise<Review[]> => {
  const response = await api.get(`/professionals/${professionalId}/reviews/`);
  return response.data;
};

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await api.post(`/professionals/${data.professionalId}/reviews/`, {
    service_id: data.serviceId,
    rating: data.rating,
    comment: data.comment
  });
  return response.data;
};

export const likeReview = async (reviewId: string): Promise<void> => {
  await api.post(`/reviews/${reviewId}/like/`);
};

// src/pages/professionals/[id].tsx (Atualização para incluir sistema de reviews)
// Exemplo de como integrar o sistema de reviews na página de profissional

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getProfessional } from '../../services/professionals';
import { getReviews, createReview, likeReview } from '../../services/reviews';
import { ReviewList } from '../../components/reviews/ReviewList';
import { ReviewForm } from '../../components/reviews/ReviewForm';
import { useAuth } from '../../hooks/useAuth';
import { Professional, Review } from '../../types/professional';

// Componente de seção de avaliações para adicionar à página do profissional
const ReviewsSection = ({ professionalId }: { professionalId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(professionalId);
        setReviews(data);
      } catch (err) {
        setError('Erro ao carregar avaliações');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [professionalId]);

  const handleSubmitReview = async (reviewData: { rating: number; comment: string; serviceId: string }) => {
    const data = await createReview({
      professionalId,
      serviceId: reviewData.serviceId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    
    setReviews([data, ...reviews]);
    setShowForm(false);
  };

  const handleLike = async (reviewId: string) => {
    try {
      await likeReview(reviewId);
    } catch (err) {
      console.error('Erro ao curtir avaliação:', err);
    }
  };

  if (loading) {
    return <div className="py-4">Carregando avaliações...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-4">Avaliações</h2>
      
      {isAuthenticated && user?.user_type === 'client' && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 w-full py-2 border border-purple-200 text-purple-600 font-medium rounded-xl hover:bg-purple-50"
        >
          Deixar uma avaliação
        </button>
      )}
      
      {showForm && (
        <ReviewForm 
          serviceId="" // Aqui seria necessário selecionar um serviço
          onSubmit={handleSubmitReview} 
        />
      )}
      
      <ReviewList reviews={reviews} onLike={handleLike} />
    </div>
  );
};

// Este é apenas um exemplo de como você integrar o ReviewsSection na página do profissional