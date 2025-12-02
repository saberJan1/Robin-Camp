package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port            string
	AuthToken       string
	DatabaseURL     string
	BoxOfficeURL    string
	BoxOfficeAPIKey string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Port:            port,
		AuthToken:       os.Getenv("AUTH_TOKEN"),
		DatabaseURL:     os.Getenv("DB_URL"),
		BoxOfficeURL:    os.Getenv("BOXOFFICE_URL"),
		BoxOfficeAPIKey: os.Getenv("BOXOFFICE_API_KEY"),
	}
}

func (c *Config) GetPort() int {
	port, err := strconv.Atoi(c.Port)
	if err != nil {
		return 8080
	}
	return port
}
