package repository

import (
	"database/sql"
	"fmt"

	"robin-camp/internal/models"
)

type MovieRepository struct {
	db *sql.DB
}

func NewMovieRepository(db *sql.DB) *MovieRepository {
	return &MovieRepository{db: db}
}

func (r *MovieRepository) Create(movie *models.Movie, boxOffice *models.BoxOffice) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Insert movie
	query := `
		INSERT INTO movies (id, title, genre, release_date, distributor, budget, mpa_rating)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err = tx.Exec(query, movie.ID, movie.Title, movie.Genre, movie.ReleaseDate,
		movie.Distributor, movie.Budget, movie.MPARating)
	if err != nil {
		return fmt.Errorf("failed to insert movie: %w", err)
	}

	// Insert box office data if available
	if boxOffice != nil {
		boxOfficeQuery := `
			INSERT INTO box_office (movie_id, revenue_worldwide, revenue_opening_weekend_usa, currency, source, last_updated)
			VALUES ($1, $2, $3, $4, $5, $6)
		`
		_, err = tx.Exec(boxOfficeQuery, movie.ID, boxOffice.Revenue.Worldwide,
			boxOffice.Revenue.OpeningWeekendUSA, boxOffice.Currency, boxOffice.Source, boxOffice.LastUpdated)
		if err != nil {
			return fmt.Errorf("failed to insert box office data: %w", err)
		}
	}

	return tx.Commit()
}

func (r *MovieRepository) GetByTitle(title string) (*models.Movie, error) {
	query := `
		SELECT m.id, m.title, m.genre, m.release_date, m.distributor, m.budget, m.mpa_rating,
		       b.revenue_worldwide, b.revenue_opening_weekend_usa, b.currency, b.source, b.last_updated
		FROM movies m
		LEFT JOIN box_office b ON m.id = b.movie_id
		WHERE m.title = $1
	`

	var movie models.Movie
	var boxOffice models.BoxOffice
	var revenueWorldwide sql.NullInt64
	var revenueOpeningWeekendUSA sql.NullInt64
	var currency sql.NullString
	var source sql.NullString
	var lastUpdated sql.NullTime

	err := r.db.QueryRow(query, title).Scan(
		&movie.ID, &movie.Title, &movie.Genre, &movie.ReleaseDate,
		&movie.Distributor, &movie.Budget, &movie.MPARating,
		&revenueWorldwide, &revenueOpeningWeekendUSA, &currency, &source, &lastUpdated,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get movie: %w", err)
	}

	// Set box office data if available
	if revenueWorldwide.Valid {
		boxOffice.Revenue.Worldwide = revenueWorldwide.Int64
		if revenueOpeningWeekendUSA.Valid {
			boxOffice.Revenue.OpeningWeekendUSA = &revenueOpeningWeekendUSA.Int64
		}
		boxOffice.Currency = currency.String
		boxOffice.Source = source.String
		boxOffice.LastUpdated = lastUpdated.Time
		movie.BoxOffice = &boxOffice
	}

	return &movie, nil
}

func (r *MovieRepository) List(filters map[string]interface{}, limit int, cursor string) ([]models.Movie, *string, error) {
	query := `
		SELECT m.id, m.title, m.genre, m.release_date, m.distributor, m.budget, m.mpa_rating,
		       b.revenue_worldwide, b.revenue_opening_weekend_usa, b.currency, b.source, b.last_updated
		FROM movies m
		LEFT JOIN box_office b ON m.id = b.movie_id
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 1

	// Apply filters
	if q, ok := filters["q"].(string); ok && q != "" {
		query += fmt.Sprintf(" AND m.title ILIKE $%d", argCount)
		args = append(args, "%"+q+"%")
		argCount++
	}

	if year, ok := filters["year"].(int); ok {
		query += fmt.Sprintf(" AND EXTRACT(YEAR FROM m.release_date) = $%d", argCount)
		args = append(args, year)
		argCount++
	}

	if genre, ok := filters["genre"].(string); ok && genre != "" {
		query += fmt.Sprintf(" AND LOWER(m.genre) = LOWER($%d)", argCount)
		args = append(args, genre)
		argCount++
	}

	if distributor, ok := filters["distributor"].(string); ok && distributor != "" {
		query += fmt.Sprintf(" AND LOWER(m.distributor) = LOWER($%d)", argCount)
		args = append(args, distributor)
		argCount++
	}

	if budget, ok := filters["budget"].(int64); ok {
		query += fmt.Sprintf(" AND m.budget <= $%d", argCount)
		args = append(args, budget)
		argCount++
	}

	if mpaRating, ok := filters["mpaRating"].(string); ok && mpaRating != "" {
		query += fmt.Sprintf(" AND m.mpa_rating = $%d", argCount)
		args = append(args, mpaRating)
		argCount++
	}

	// Apply cursor
	if cursor != "" {
		query += fmt.Sprintf(" AND m.id > $%d", argCount)
		args = append(args, cursor)
		argCount++
	}

	// Order and limit
	query += " ORDER BY m.id ASC"
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, limit+1) // Fetch one extra to determine if there's a next page
	}

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to list movies: %w", err)
	}
	defer rows.Close()

	var movies []models.Movie
	for rows.Next() {
		var movie models.Movie
		var boxOffice models.BoxOffice
		var revenueWorldwide sql.NullInt64
		var revenueOpeningWeekendUSA sql.NullInt64
		var currency sql.NullString
		var source sql.NullString
		var lastUpdated sql.NullTime

		err := rows.Scan(
			&movie.ID, &movie.Title, &movie.Genre, &movie.ReleaseDate,
			&movie.Distributor, &movie.Budget, &movie.MPARating,
			&revenueWorldwide, &revenueOpeningWeekendUSA, &currency, &source, &lastUpdated,
		)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to scan movie: %w", err)
		}

		// Set box office data if available
		if revenueWorldwide.Valid {
			boxOffice.Revenue.Worldwide = revenueWorldwide.Int64
			if revenueOpeningWeekendUSA.Valid {
				boxOffice.Revenue.OpeningWeekendUSA = &revenueOpeningWeekendUSA.Int64
			}
			boxOffice.Currency = currency.String
			boxOffice.Source = source.String
			boxOffice.LastUpdated = lastUpdated.Time
			movie.BoxOffice = &boxOffice
		}

		movies = append(movies, movie)
	}

	// Determine next cursor
	var nextCursor *string
	if limit > 0 && len(movies) > limit {
		movies = movies[:limit]
		lastID := movies[len(movies)-1].ID
		nextCursor = &lastID
	}

	return movies, nextCursor, nil
}
