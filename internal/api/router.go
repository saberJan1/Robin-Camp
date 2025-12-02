package api

import (
	"github.com/gorilla/mux"
	"robin-camp/internal/api/handlers"
	"robin-camp/internal/api/middleware"
)

func SetupRouter(
	movieHandler *handlers.MovieHandler,
	ratingHandler *handlers.RatingHandler,
	healthHandler *handlers.HealthHandler,
	authToken string,
) *mux.Router {
	r := mux.NewRouter()

	// Apply logger middleware globally
	r.Use(middleware.Logger)

	// Health check (no auth)
	r.HandleFunc("/healthz", healthHandler.HealthCheck).Methods("GET")

	// Movies endpoints
	r.HandleFunc("/movies", movieHandler.ListMovies).Methods("GET")
	
	// Create movie requires auth
	createMovieRouter := r.PathPrefix("/movies").Subrouter()
	createMovieRouter.Use(middleware.AuthMiddleware(authToken))
	createMovieRouter.HandleFunc("", movieHandler.CreateMovie).Methods("POST")

	// Ratings endpoints
	r.HandleFunc("/movies/{title}/rating", ratingHandler.GetRatingAggregate).Methods("GET")
	
	// Submit rating requires X-Rater-Id
	submitRatingRouter := r.PathPrefix("/movies/{title}/ratings").Subrouter()
	submitRatingRouter.Use(middleware.RaterIDMiddleware)
	submitRatingRouter.HandleFunc("", ratingHandler.SubmitRating).Methods("POST")

	return r
}
