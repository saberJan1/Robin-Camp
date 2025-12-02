package repository

import (
	"database/sql"
	"fmt"
	"math"

	"robin-camp/internal/models"
)

type RatingRepository struct {
	db *sql.DB
}

func NewRatingRepository(db *sql.DB) *RatingRepository {
	return &RatingRepository{db: db}
}

func (r *RatingRepository) Upsert(movieID, raterID string, rating float64) (bool, error) {
	query := `
		INSERT INTO ratings (movie_id, rater_id, rating)
		VALUES ($1, $2, $3)
		ON CONFLICT (movie_id, rater_id)
		DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
		RETURNING (xmax = 0) AS inserted
	`

	var inserted bool
	err := r.db.QueryRow(query, movieID, raterID, rating).Scan(&inserted)
	if err != nil {
		return false, fmt.Errorf("failed to upsert rating: %w", err)
	}

	return inserted, nil
}

func (r *RatingRepository) GetAggregate(movieID string) (*models.RatingAggregate, error) {
	query := `
		SELECT COALESCE(AVG(rating), 0) as average, COUNT(*) as count
		FROM ratings
		WHERE movie_id = $1
	`

	var avg float64
	var count int

	err := r.db.QueryRow(query, movieID).Scan(&avg, &count)
	if err != nil {
		return nil, fmt.Errorf("failed to get rating aggregate: %w", err)
	}

	// Round to 1 decimal place
	avg = math.Round(avg*10) / 10

	return &models.RatingAggregate{
		Average: avg,
		Count:   count,
	}, nil
}
