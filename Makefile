.PHONY: docker-up docker-down test-e2e

docker-up:
	@echo "Building and starting containers..."
	docker compose up -d --build
	@echo "Waiting for services to be healthy..."
	@timeout=60; \
	while [ $$timeout -gt 0 ]; do \
		if docker compose ps | grep -q "healthy"; then \
			echo "Services are healthy!"; \
			break; \
		fi; \
		echo "Waiting for health checks... ($$timeout seconds remaining)"; \
		sleep 2; \
		timeout=$$((timeout - 2)); \
	done

docker-down:
	@echo "Stopping and removing containers..."
	docker compose down -v

test-e2e:
	@echo "Running E2E tests..."
	bash ./e2e-test.sh
