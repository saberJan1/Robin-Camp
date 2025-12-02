-- Drop indexes
DROP INDEX IF EXISTS idx_ratings_rater_id;
DROP INDEX IF EXISTS idx_ratings_movie_id;
DROP INDEX IF EXISTS idx_movies_mpa_rating;
DROP INDEX IF EXISTS idx_movies_budget;
DROP INDEX IF EXISTS idx_movies_distributor;
DROP INDEX IF EXISTS idx_movies_year;
DROP INDEX IF EXISTS idx_movies_genre;
DROP INDEX IF EXISTS idx_movies_title;

-- Drop tables
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS box_office;
DROP TABLE IF EXISTS movies;
