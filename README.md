# Star Wars API

## 📂 Project Folder Tree

```text
star-wars-api
├── src
│   ├── auth                 # Authentication and authorization logic
│   │   ├── controllers
│   │   ├── decorators
│   │   ├── dto
│   │   ├── guards
│   │   ├── interfaces
│   │   ├── modules
│   │   ├── services
│   │   └── strategies
│   ├── films                # Core domain for films and external SWAPI sync
│   │   ├── controllers
│   │   ├── dto
│   │   ├── filters
│   │   ├── interfaces
│   │   ├── mappers
│   │   ├── modules
│   │   ├── repositories
│   │   └── services
│   ├── prisma               # Database abstraction using Prisma
│   │   ├── modules
│   │   └── services
│   ├── users                # User entity management
│   │   ├── mappers
│   │   ├── modules
│   │   ├── repositories
│   │   └── services
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── prisma                   # Database schemas and migrations
│   ├── migrations
│   └── schema.prisma
├── test                     # Testing suites
│   ├── e2e
│   ├── integration
│   └── unit
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker configuration for API
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## ⚙️ Installation Guide

### Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (or separate Docker Engine and Docker Compose)
- npm or yarn

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/star-wars-api.git
   cd star-wars-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   _Edit the `.env` file inside your project root to match your local setup._

## 🚀 Running the project locally

To run the project completely in local environment using Node:

1. **Start the database container:**
   Make sure you have Docker running in the background.

   ```bash
   docker-compose up -d db
   ```

2. **Run database migrations:**
   Apply the current schema to the PostgreSQL instance.

   ```bash
   npx prisma migrate dev
   ```

3. **Start the application:**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

The application will be available at `http://localhost:3000`.

## 🐳 Running with Docker

You can run the entire application stack (API and database) using Docker Compose.

1. **Build and start all containers:**

   ```bash
   docker-compose up -d --build
   ```

2. **Check the logs (optional):**

   ```bash
   docker-compose logs -f api
   ```

3. **Stop the containers:**
   ```bash
   docker-compose down
   ```

## 🔐 Environment Variables

The project uses environment variables for configuration to avoid hardcoded credentials. Below is a sample `.env` configuration:

```env
# Database complete connection string
DATABASE_URL="postgresql://nestjs:nestjs_password@localhost:5433/star_wars_api?schema=public"

# Secret key used for signing JWT tokens
JWT_SECRET="super_secret_star_wars_key_12345"

# External API base URL
SWAPI_URL="https://www.swapi.tech/api/films"
```

## 🗄 Database Setup

This project uses [Prisma ORM](https://www.prisma.io/). When changing models in `prisma/schema.prisma`, use the following commands:

- **Generate the Prisma Client**:
  ```bash
  npx prisma generate
  ```
- **Create a new migration**:
  ```bash
  npx prisma migrate dev --name your_migration_name
  ```
- **Apply migrations in production**:
  ```bash
  npx prisma migrate deploy
  ```

## 🧪 Testing

The repository has comprehensive test suites covering Unit, Integration, and End-to-End (E2E) testing.

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run all tests with coverage
npm run test:cov
```

## 📡 API Usage

The application uses explicit DTOs for input validation and structured interfaces for responses.

### Common Endpoints

**Authentication:**

- `POST /auth/register` - Create a new user account.
- `POST /auth/login` - Authenticate and receive a JWT token.

**Films:**

- `GET /films` - List all films (allows filtering).
- `GET /films/:id` - Get details of a specific film.
- `POST /films` - Create a new film entry (Admin only).
- `PATCH /films/:id` - Update an existing film (Admin only).
- `DELETE /films/:id` - Soft delete a film (Admin only).
