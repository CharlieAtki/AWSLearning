## Running the Project with Docker

This project provides Dockerfiles for each major service (`backend`, `frontend`, and `ai-service`) and a `docker-compose` configuration for streamlined local development and deployment.

### Requirements
- Docker and Docker Compose installed
- Node.js version `22.13.1` is used in all service containers (handled by Dockerfiles)

### Environment Variables
- The backend and frontend services require environment variables defined in their respective `.env` files:
  - `./backend/.env`
  - `./frontend/.env`
- If you need to configure the AI service, create an `.env` file in `./ai-service` and uncomment the `env_file` line in the compose file.

### Build and Run
1. Ensure your `.env` files are present in `./backend` and `./frontend` (and optionally `./ai-service`).
2. From the project root, run:
   ```sh
   docker compose up --build
   ```
   This will build and start all services as defined in the compose file.

### Service Ports
- **Backend**: Exposed on `localhost:3000`
- **Frontend**: Exposed on `localhost:4173`
- **AI Service**: No ports exposed by default (internal service)

### Special Configuration
- All services run as non-root users for improved security.
- The frontend uses Vite's preview server by default; if you need to change the port or start command, update the Dockerfile and compose file accordingly.
- All services are connected via a shared Docker network (`appnet`) for internal communication.

### Notes
- If you add or modify environment variables, rebuild the affected service(s) with `docker compose up --build`.
- The `ai-service` is started without exposed ports; if you need external access, update its Dockerfile and compose file accordingly.
