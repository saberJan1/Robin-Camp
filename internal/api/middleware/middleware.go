package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"robin-camp/internal/models"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
		log.Printf("%s %s completed in %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func AuthMiddleware(authToken string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := r.Header.Get("Authorization")
			if token == "" {
				respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authorization header")
				return
			}

			// Check Bearer token
			expectedToken := "Bearer " + authToken
			if token != expectedToken {
				respondError(w, http.StatusForbidden, "FORBIDDEN", "Invalid authorization token")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RaterIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		raterID := r.Header.Get("X-Rater-Id")
		if raterID == "" {
			respondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing X-Rater-Id header")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func respondError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(models.Error{
		Code:    code,
		Message: message,
	})
}
