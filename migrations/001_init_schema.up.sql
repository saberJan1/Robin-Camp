-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    genre VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    distributor VARCHAR(255),
    budget BIGINT,
    mpa_rating VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create box_office table
CREATE TABLE IF NOT EXISTS box_office (
    movie_id VARCHAR(50) PRIMARY KEY,
    revenue_worldwide BIGINT NOT NULL,
    revenue_opening_weekend_usa BIGINT,
    currency VARCHAR(10) NOT NULL,
    source VARCHAR(100) NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    movie_id VARCHAR(50) NOT NULL,
    rater_id VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE (movie_id, rater_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_year ON movies(EXTRACT(YEAR FROM release_date));
CREATE INDEX idx_movies_distributor ON movies(distributor);
CREATE INDEX idx_movies_budget ON movies(budget);
CREATE INDEX idx_movies_mpa_rating ON movies(mpa_rating);
CREATE INDEX idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
