package service

import (
	"fmt"
	"log"
	"time"

	"robin-camp/internal/client"
	"robin-camp/internal/models"
	"robin-camp/internal/repository"
)

type MovieService struct {
	repo            *repository.MovieRepository
	boxOfficeClient *client.BoxOfficeClient
}

func NewMovieService(repo *repository.MovieRepository, boxOfficeClient *client.BoxOfficeClient) *MovieService {
	return &MovieService{
		repo:            repo,
		boxOfficeClient: boxOfficeClient,
	}
}

func (s *MovieService) CreateMovie(req *models.MovieCreate) (*models.Movie, error) {
	// Generate movie ID
	movieID := fmt.Sprintf("m_%d", time.Now().UnixNano())

	// Create movie object
	movie := &models.Movie{
		ID:          movieID,
		Title:       req.Title,
		Genre:       req.Genre,
		ReleaseDate: req.ReleaseDate,
		Distributor: req.Distributor,
		Budget:      req.Budget,
		MPARating:   req.MPARating,
	}

	// Try to fetch box office data
	var boxOffice *models.BoxOffice
	boxOfficeResp, err := s.boxOfficeClient.GetBoxOffice(req.Title)
	if err != nil {
		// Log error but don't fail the creation
		log.Printf("Failed to fetch box office data for '%s': %v", req.Title, err)
	} else {
		// Merge box office data
		boxOffice = &models.BoxOffice{
			Revenue: models.Revenue{
				Worldwide:         boxOfficeResp.Revenue.Worldwide,
				OpeningWeekendUSA: boxOfficeResp.Revenue.OpeningWeekendUSA,
			},
			Currency:    "USD",
			Source:      "ExampleBoxOfficeAPI",
			LastUpdated: time.Now().UTC(),
		}

		// User-provided fields take precedence
		if movie.Distributor == nil && boxOfficeResp.Distributor != "" {
			movie.Distributor = &boxOfficeResp.Distributor
		}
		if movie.Budget == nil && boxOfficeResp.Budget > 0 {
			movie.Budget = &boxOfficeResp.Budget
		}
		if movie.MPARating == nil && boxOfficeResp.MPARating != "" {
			movie.MPARating = &boxOfficeResp.MPARating
		}
	}

	// Save to database
	if err := s.repo.Create(movie, boxOffice); err != nil {
		return nil, fmt.Errorf("failed to create movie: %w", err)
	}

	// Set box office in response
	movie.BoxOffice = boxOffice

	return movie, nil
}

func (s *MovieService) GetMovieByTitle(title string) (*models.Movie, error) {
	return s.repo.GetByTitle(title)
}

func (s *MovieService) ListMovies(filters map[string]interface{}, limit int, cursor string) (*models.MoviePage, error) {
	movies, nextCursor, err := s.repo.List(filters, limit, cursor)
	if err != nil {
		return nil, err
	}

	return &models.MoviePage{
		Items:      movies,
		NextCursor: nextCursor,
	}, nil
}
