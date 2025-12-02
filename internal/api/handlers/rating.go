package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"robin-camp/internal/models"
	"robin-camp/internal/service"
)

type RatingHandler struct {
	ratingService *service.RatingService
}

func NewRatingHandler(ratingService *service.RatingService) *RatingHandler {
	return &RatingHandler{ratingService: ratingService}
}

func (h *RatingHandler) SubmitRating(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	title := vars["title"]

	raterID := r.Header.Get("X-Rater-Id")

	var req models.RatingSubmit
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusUnprocessableEntity, "BAD_REQUEST", "Invalid request body")
		return
	}

	// Validate rating value
	validRatings := []float64{0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0}
	valid := false
	for _, v := range validRatings {
		if req.Rating == v {
			valid = true
			break
		}
	}
	if !valid {
		respondError(w, http.StatusUnprocessableEntity, "BAD_REQUEST", "Invalid rating value")
		return
	}

	rating, isNew, err := h.ratingService.SubmitRating(title, raterID, req.Rating)
	if err != nil {
		if err.Error() == "movie not found" {
			respondError(w, http.StatusNotFound, "NOT_FOUND", "Movie not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	status := http.StatusOK
	if isNew {
		status = http.StatusCreated
		w.Header().Set("Location", "/movies/"+title+"/ratings")
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(rating)
}

func (h *RatingHandler) GetRatingAggregate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	title := vars["title"]

	aggregate, err := h.ratingService.GetRatingAggregate(title)
	if err != nil {
		if err.Error() == "movie not found" {
			respondError(w, http.StatusNotFound, "NOT_FOUND", "Movie not found")
			return
		}
		respondError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(aggregate)
}
