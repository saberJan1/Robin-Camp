package main

import (
	"fmt"
	"log"
	"net/http"

	"robin-camp/internal/api"
	"robin-camp/internal/api/handlers"
	"robin-camp/internal/client"
	"robin-camp/internal/config"
	"robin-camp/internal/database"
	"robin-camp/internal/repository"
	"robin-camp/internal/service"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db, "./migrations"); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize repositories
	movieRepo := repository.NewMovieRepository(db)
	ratingRepo := repository.NewRatingRepository(db)

	// Initialize clients
	boxOfficeClient := client.NewBoxOfficeClient(cfg.BoxOfficeURL, cfg.BoxOfficeAPIKey)

	// Initialize services
	movieService := service.NewMovieService(movieRepo, boxOfficeClient)
	ratingService := service.NewRatingService(movieRepo, ratingRepo)

	// Initialize handlers
	movieHandler := handlers.NewMovieHandler(movieService)
	ratingHandler := handlers.NewRatingHandler(ratingService)
	healthHandler := handlers.NewHealthHandler()

	// Setup router
	router := api.SetupRouter(movieHandler, ratingHandler, healthHandler, cfg.AuthToken)

	// Start server
	addr := fmt.Sprintf("0.0.0.0:%s", cfg.Port)
	log.Printf("Starting server on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
