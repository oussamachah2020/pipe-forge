# Express SQLite API with CI/CD

A simple Express.js API with SQLite database, complete with automated testing and CI/CD pipeline.

## Features

- Express.js REST API
- SQLite database with type-safe operations
- Comprehensive testing with Jest and Supertest
- Code quality checks with ESLint and Prettier
- Docker containerization
- Automated CI/CD with GitHub Actions

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Git
- GitHub account
- Docker Hub account

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and adjust values:
```bash
cp .env.example .env
```

### 3. Run Locally

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 4. Run Tests
```bash
npm test
```

### 5. Check Code Quality
```bash
npm run lint
npm run format
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /items` - Retrieve all items
- `POST /items` - Create a new item (requires JSON body with `name` and optional `description`)

## Docker Usage

### Build the Image
```bash
docker build -t express-sqlite-api .
```

### Run with Docker Compose
```bash
docker-compose up
```

## CI/CD Setup

### 1. Create Docker Hub Repository

Go to Docker Hub and create a new repository named `express-sqlite-api`

### 2. Add GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, then add:

- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Your Docker Hub access token

### 3. Push to GitHub

The CI/CD pipeline will automatically:
- Run linting and tests on every push and PR
- Build and push Docker images on push to main branch

## Project Structure
```
├── src/           # Source code
├── tests/         # Test files
├── .github/       # GitHub Actions workflows
└── Dockerfile     # Docker configuration
```

## License

MIT
```

This README provides clear instructions for anyone who wants to use or contribute to your project.

---

**What we just did for Express.js:** We created a complete Express API with SQLite database support, proper TypeScript configuration, comprehensive tests, Docker containerization, and a GitHub Actions CI/CD pipeline. Each file is carefully crafted to work together as a cohesive system.

---

## Part 2B: NestJS Implementation (TypeScript)

Now let me provide the NestJS version. NestJS is a more opinionated framework that provides structure and built-in features like dependency injection, making it great for larger applications.

### File Tree Structure
```
nestjs-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── items/
│   │   ├── dto/
│   │   │   └── create-item.dto.ts
│   │   ├── entities/
│   │   │   └── item.entity.ts
│   │   ├── items.controller.ts
│   │   ├── items.service.ts
│   │   └── items.module.ts
│   ├── database/
│   │   ├── database.service.ts
│   │   └── database.module.ts
│   ├── health/
│   │   └── health.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .dockerignore
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md