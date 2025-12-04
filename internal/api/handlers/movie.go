package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"robin-camp/internal/models"
	"robin-camp/internal/service"
)

type MovieHandler struct {
	movieService *service.MovieService
}

func NewMovieHandler(movieService *service.MovieService) *MovieHandler {
	return &MovieHandler{movieService: movieService}
}

func (h *MovieHandler) CreateMovie(w http.ResponseWriter, r *http.Request) {
	var req models.MovieCreate
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusUnprocessableEntity, "BAD_REQUEST", "Invalid request body")
		return
	}

	// Validate required fields
	if req.Title == "" || req.Genre == "" || req.ReleaseDate == "" {
		respondError(w, http.StatusUnprocessableEntity, "BAD_REQUEST", "Missing required fields")
		return
	}

	movie, err := h.movieService.CreateMovie(&req)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	// Set Location header
	w.Header().Set("Location", fmt.Sprintf("/movies/%s", movie.Title))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(movie)
}

func (h *MovieHandler) ListMovies(w http.ResponseWriter, r *http.Request) {
	filters := make(map[string]interface{})

	// Parse query parameters
	if q := r.URL.Query().Get("q"); q != "" {
		filters["q"] = q
	}

	if yearStr := r.URL.Query().Get("year"); yearStr != "" {
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			respondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid year parameter")
			return
		}
		filters["year"] = year
	}

	if genre := r.URL.Query().Get("genre"); genre != "" {
		filters["genre"] = genre
	}

	if distributor := r.URL.Query().Get("distributor"); distributor != "" {
		filters["distributor"] = distributor
	}

	if budgetStr := r.URL.Query().Get("budget"); budgetStr != "" {
		budget, err := strconv.ParseInt(budgetStr, 10, 64)
		if err != nil {
			respondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid budget parameter")
			return
		}
		filters["budget"] = budget
	}

	if mpaRating := r.URL.Query().Get("mpaRating"); mpaRating != "" {
		filters["mpaRating"] = mpaRating
	}

	limit := 20 // Default limit
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		parsedLimit, err := strconv.Atoi(limitStr)
		if err != nil || parsedLimit < 1 {
			respondError(w, http.StatusBadRequest, "BAD_REQUEST", "Invalid limit parameter")
			return
		}
		limit = parsedLimit
	}

	cursor := r.URL.Query().Get("cursor")

	page, err := h.movieService.ListMovies(filters, limit, cursor)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(page)
}

func respondError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.Error{
		Code:    code,
		Message: message,
	})
}
