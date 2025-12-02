package client

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"robin-camp/internal/models"
)

type BoxOfficeClient struct {
	baseURL string
	apiKey  string
	client  *http.Client
}

func NewBoxOfficeClient(baseURL, apiKey string) *BoxOfficeClient {
	return &BoxOfficeClient{
		baseURL: baseURL,
		apiKey:  apiKey,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *BoxOfficeClient) GetBoxOffice(title string) (*models.BoxOfficeResponse, error) {
	// Build URL with query parameter
	u, err := url.Parse(c.baseURL + "/boxoffice")
	if err != nil {
		return nil, fmt.Errorf("invalid base URL: %w", err)
	}

	q := u.Query()
	q.Set("title", title)
	u.RawQuery = q.Encode()

	// Create request
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add API key header
	req.Header.Set("X-API-Key", c.apiKey)

	// Execute request
	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("upstream returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var boxOfficeResp models.BoxOfficeResponse
	if err := json.NewDecoder(resp.Body).Decode(&boxOfficeResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &boxOfficeResp, nil
}
