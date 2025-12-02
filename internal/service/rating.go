package service

import (
	"fmt"

	"robin-camp/internal/models"
	"robin-camp/internal/repository"
)

type RatingService struct {
	movieRepo  *repository.MovieRepository
	ratingRepo *repository.RatingRepository
}

func NewRatingService(movieRepo *repository.MovieRepository, ratingRepo *repository.RatingRepository) *RatingService {
	return &RatingService{
		movieRepo:  movieRepo,
		ratingRepo: ratingRepo,
	}
}

func (s *RatingService) SubmitRating(title, raterID string, rating float64) (*models.Rating, bool, error) {
	// Check if movie exists
	movie, err := s.movieRepo.GetByTitle(title)
	if err != nil {
		return nil, false, fmt.Errorf("failed to get movie: %w", err)
	}
	if movie == nil {
		return nil, false, fmt.Errorf("movie not found")
	}

	// Upsert rating
	isNew, err := s.ratingRepo.Upsert(movie.ID, raterID, rating)
	if err != nil {
		return nil, false, fmt.Errorf("failed to submit rating: %w", err)
	}

	return &models.Rating{
		MovieTitle: title,
		RaterID:    raterID,
		Rating:     rating,
	}, isNew, nil
}

func (s *RatingService) GetRatingAggregate(title string) (*models.RatingAggregate, error) {
	// Check if movie exists
	movie, err := s.movieRepo.GetByTitle(title)
	if err != nil {
		return nil, fmt.Errorf("failed to get movie: %w", err)
	}
	if movie == nil {
		return nil, fmt.Errorf("movie not found")
	}

	// Get aggregate
	return s.ratingRepo.GetAggregate(movie.ID)
}
