package models

import "time"

type Movie struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	ReleaseDate string     `json:"releaseDate"`
	Genre       string     `json:"genre"`
	Distributor *string    `json:"distributor,omitempty"`
	Budget      *int64     `json:"budget,omitempty"`
	MPARating   *string    `json:"mpaRating,omitempty"`
	BoxOffice   *BoxOffice `json:"boxOffice,omitempty"`
}

type BoxOffice struct {
	Revenue     Revenue   `json:"revenue"`
	Currency    string    `json:"currency"`
	Source      string    `json:"source"`
	LastUpdated time.Time `json:"lastUpdated"`
}

type Revenue struct {
	Worldwide          int64  `json:"worldwide"`
	OpeningWeekendUSA  *int64 `json:"openingWeekendUSA,omitempty"`
}

type MovieCreate struct {
	Title       string  `json:"title"`
	Genre       string  `json:"genre"`
	ReleaseDate string  `json:"releaseDate"`
	Distributor *string `json:"distributor,omitempty"`
	Budget      *int64  `json:"budget,omitempty"`
	MPARating   *string `json:"mpaRating,omitempty"`
}

type MoviePage struct {
	Items      []Movie `json:"items"`
	NextCursor *string `json:"nextCursor,omitempty"`
}

type Rating struct {
	MovieTitle string  `json:"movieTitle"`
	RaterID    string  `json:"raterId"`
	Rating     float64 `json:"rating"`
}

type RatingSubmit struct {
	Rating float64 `json:"rating"`
}

type RatingAggregate struct {
	Average float64 `json:"average"`
	Count   int     `json:"count"`
}

type Error struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

type BoxOfficeResponse struct {
	Title       string    `json:"title"`
	Distributor string    `json:"distributor"`
	ReleaseDate string    `json:"releaseDate"`
	Budget      int64     `json:"budget"`
	Revenue     Revenue   `json:"revenue"`
	MPARating   string    `json:"mpaRating"`
}
