# RSS Feed Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.7.0-blue.svg)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
    - [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)

## Description

**Omni Feed Hub** is a RESTful API built with Node.js and TypeScript, designed to manage RSS feeds and organize them
into collections. Leveraging Clean Architecture principles, the application ensures a modular, maintainable, and
scalable codebase. The API uses SQLite as the database, managed through TypeORM, and includes comprehensive API
documentation via Swagger.

## Features

- **CRUD Operations**: Manage RSS Feeds, Collections, Articles, and AI Agents.
- **AI Integration**: Analyze articles using AI agents (e.g., Ollama, ChatGPT).
- **Flexible Analysis Configuration**: Customizable AI prompts and roles for agents.
- **Data Validation**: Ensures data integrity using class-validator.
- **Error Handling**: Centralized error handling for robust and predictable API behavior.
- **API Documentation**: Interactive API documentation via Swagger UI.
- **Clean Architecture**: Ensures separation of concerns for better maintainability and scalability.
- **Testing**: Includes unit and E2E tests to ensure robustness and reliability.

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Nestjs
- **ORM:** TypeORM
- **Database:** SQLite
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger UI
- **Testing Frameworks:** Jest, Supertest

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js:** Version 20.x or higher
- **pnpm:** For dependency management, comes with Node.js
- **Git:** For version control (optional)
- **Ollama:** For using AI locally (optional)

### Installation

1. **Clone the Repository**

    ```bash
    git clone git@github.com:zohac/omni-feed-hub.git
    cd omni-feed-hub
    ```

2. **Install Dependencies**

   Using pnpm:

    ```bash
    pnpm install
    ```

### Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory of the project to configure environment-specific settings. You should have
   separate `.env` files for each environment:

    * `.env`: For production.

    * `.env.test`: For testing.

    * `.env.development`: For development.

   Use the provided .`env.exemple` file as a template for your environment files.

   Example `.env` file:

    ```env
    PORT=3000
    DATABASE_TYPE=sqlite
    #DATABASE_PATH=:memory: #For Testing
    DATABASE_PATH=./rssfeeds.sqlite
    OLLAMA_BASE_URL=http://localhost:11434
    ```

    - `PORT`: The port on which the server will run. Default is 3000.
    - `DATABASE_PATH`: Path to the SQLite database file. Default is `./rssfeeds.sqlite`.

2. **TypeScript Configuration**

   Ensure your `tsconfig.json` includes the following settings:

    ```json
   {
     "compilerOptions": {
       "module": "commonjs",
       "declaration": true,
       "removeComments": true,
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
       "allowSyntheticDefaultImports": true,
       "target": "ES2021",
       "sourceMap": true,
       "outDir": "./dist",
       "baseUrl": "./",
       "incremental": true,
       "skipLibCheck": true,
       "strictNullChecks": false,
       "noImplicitAny": false,
       "strictBindCallApply": false,
       "forceConsistentCasingInFileNames": false,
       "noFallthroughCasesInSwitch": false
     },
     "exclude": ["node_modules/", "dist/"],
     "include": ["src/**/*.ts"]
    }
    ```

### Running the Application

1. **Start the Development Server**

    ```bash
    pnpm start
    ```
   This command uses ts-node to run the TypeScript application directly.

   OR

    ```bash
    pnpm start:dev
    ```

2. **Build for Production**

   To compile the TypeScript code into JavaScript:

    ```bash
    pnpm start:prod
    ```

### Running Tests

This project includes unit and E2E tests to ensure code reliability.

1. **Run All Tests**

    ```bash
    pnpm test
    ```

2. **Run Tests in Watch Mode**

    ```bash
    pnpm test:watch
    ```

3. **Generate Test Coverage Report**

    ```bash
    pnpm test:cov
    ```

## Getting Started (with Docker)

### Prerequisites

Ensure you have the following installed on your machine:

- **Docker**: For containerization
- **Docker Compose**: To orchestrate services
- **pnpm:** For dependency management (inside the container)
- **Node.js:** Version 20.x or higher (optional for local development)

### Docker Setup

#### 1. Development Setup

To start the development environment with Docker:

```bash
docker compose -f docker-compose.dev.yaml up
```

This will start the development server, automatically reload on file changes, and map the local project files to the
container.

#### 2. Running Tests in Docker

Run unit and E2E tests:

```bash
docker compose -f docker-compose.dev.yaml run app env NODE_ENV=test pnpm test
```

Run tests with coverage:

```bash
docker compose -f docker-compose.dev.yaml run app env NODE_ENV=test pnpm test:cov
```

The coverage report will be generated in the ./coverage directory.
Note: If you encounter permission issues with the coverage directory, update the ownership by running:

```bash
sudo chown -R $USER:$USER ./coverage
```

#### 3. Build for Production

To build and run the application for production:

```bash
docker compose -f docker-compose.prod.yaml up --build
```

### Docker Compose Configuration

* docker-compose.dev.yaml – Development environment with live reload and volume mounting.
* docker-compose.prod.yaml – Production environment for optimized builds.
* Dockerfile.dev – Builds the development container, installs dependencies, and starts the application in watch mode.

### Testing

The project supports comprehensive unit and end-to-end (E2E) tests, executed via Docker.

Run Tests inside Docker:

```bash
docker compose -f docker-compose.dev.yaml run app env NODE_ENV=test pnpm test:cov
```

The report is accessible in the ./coverage directory.

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## Project Structure

```bash
omni-feed-hub/
├── src/
│   ├── application/
│   │   ├── commands/
│   │   │   └── assign.to.collection.command.ts
│   │   ├── dtos/
│   │   │   ├── action.dto.ts
│   │   │   ├── ai-agent.dto.ts
│   │   │   ├── ai-configuration.dto.ts
│   │   │   ├── article.collection.dto.ts
│   │   │   ├── article.dto.ts
│   │   │   ├── article.state.dto.ts
│   │   │   ├── article.tag.dto.ts
│   │   │   ├── assign.action.to.agent.dto.ts
│   │   │   ├── assign.to.collection.action.dto.ts
│   │   │   ├── media.attachment.dto.ts
│   │   │   ├── rss-feed.collection.dto.ts
│   │   │   └── rss-feed.dto.ts
│   │   ├── executor/
│   │   │   └── task.executor.ts
│   │   ├── factories/
│   │   │   ├── action.dto.factory.ts
│   │   │   ├── assign.action.to.agent.dto.factory.ts
│   │   │   └── command.factory.ts
│   │   ├── orchestrators/
│   │   │   └── task.orchestrator.ts
│   │   ├── scheduler/
│   │   │   ├── parse.feed.scheduler.ts
│   │   │   └── task.scheduler.ts
│   │   └── usecases/
│   │       ├── action.use-cases.ts
│   │       ├── ai-agent.use-cases.ts
│   │       ├── analysis.use-cases.ts
│   │       ├── article.collection.use-cases.ts
│   │       ├── article.use-cases.ts
│   │       ├── assign-actions-to-agent.use-cases.ts
│   │       ├── parse.feed.use-cases.ts
│   │       ├── rss-feed.collection.use-cases.ts
│   │       ├── rss-feed.use-cases.ts
│   │       └── task.use-cases.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── action.ts
│   │   │   ├── ai-agent.ts
│   │   │   ├── ai-configuration.ts
│   │   │   ├── article.analyse.ts
│   │   │   ├── article.collection.ts
│   │   │   ├── article.ts
│   │   │   ├── assign.to.collection.action.ts
│   │   │   ├── media.attachment.ts
│   │   │   ├── rss-feed.collection.ts
│   │   │   ├── rss-feed.ts
│   │   │   └── task.ts
│   │   ├── enums/
│   │   │   ├── action.type.ts
│   │   │   ├── ai-agent.provider.ts
│   │   │   ├── ai-agent.role.ts
│   │   │   ├── article.analysis.status.ts
│   │   │   ├── article.source.type.ts
│   │   │   ├── task.mode.ts
│   │   │   └── task.status.ts
│   │   └── interfaces/
│   │       ├── action.repository.ts
│   │       ├── ai-agent.repository.ts
│   │       ├── ai-service.factory.ts
│   │       ├── ai-service.ts
│   │       ├── article.repository.ts
│   │       ├── article.state.ts
│   │       ├── base.collection.ts
│   │       ├── entity.ts
│   │       ├── item.parser.ts
│   │       ├── logger.ts
│   │       ├── parser.output.ts
│   │       ├── repository.ts
│   │       ├── rss-parser.ts
│   │       ├── task.command.ts
│   │       ├── task.repository.ts
│   │       └── usecases.ts
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   └── nest-logger.adapter.ts
│   │   ├── config/
│   │   │   ├── ai.config.ts
│   │   │   └── database.config.ts
│   │   ├── entities/
│   │   │   ├── action.entity.ts
│   │   │   ├── ai-agent.entity.ts
│   │   │   ├── ai-configuration.entity.ts
│   │   │   ├── article.analyse.entity.ts
│   │   │   ├── article.collection.entity.ts
│   │   │   ├── article.entity.ts
│   │   │   ├── assign.to.collection.action.entity.ts
│   │   │   ├── index.ts
│   │   │   ├── media.attachment.entity.ts
│   │   │   ├── rss-feed.collection.entity.ts
│   │   │   ├── rss-feed.entity.ts
│   │   │   └── task.entity.ts
│   │   ├── factories/
│   │   │   └── ai-service.factory.ts
│   │   ├── integrations/
│   │   │   └── ollama.service.ts
│   │   ├── mappers/
│   │   │   ├── action.mapper.ts
│   │   │   ├── ai-agent.mapper.ts
│   │   │   ├── ai-configuration.mapper.ts
│   │   │   ├── article.analysis.mapper.ts
│   │   │   ├── article.collection.mapper.ts
│   │   │   ├── article.mapper.ts
│   │   │   ├── media.attachment.mapper.ts
│   │   │   ├── rss-feed.collection.mapper.ts
│   │   │   ├── rss-feed.mapper.ts
│   │   │   └── task.mapper.ts
│   │   ├── modules/
│   │   │   └── infrastructure.module.ts
│   │   ├── repositories/
│   │   │   ├── action.repository.ts
│   │   │   ├── ai-agent.repository.ts
│   │   │   ├── article.analysis.repository.ts
│   │   │   ├── article.collection.repository.ts
│   │   │   ├── article.repository.ts
│   │   │   ├── rss-feed.collection.repository.ts
│   │   │   ├── rss-feed.repository.ts
│   │   │   └── task.repository.ts
│   │   ├── schedulers/
│   │   │   └── schedule.module.ts
│   │   └── services/
│   │       └── rss-parser.service.ts
│   ├── presentation/
│   │   ├── modules/
│   │   │   ├── action/
│   │   │   │   ├── action.controller.ts
│   │   │   │   └── action.module.ts
│   │   │   ├── ai-agent/
│   │   │   │   ├── ai-agent.controller.ts
│   │   │   │   └── ai-agent.module.ts
│   │   │   ├── article/
│   │   │   │   ├── article.controller.ts
│   │   │   │   └── article.module.ts
│   │   │   ├── article-collection/
│   │   │   │   ├── article.collection.controller.ts
│   │   │   │   └── article.collection.module.ts
│   │   │   ├── rss-feed/
│   │   │   │   ├── rss-feed.controller.ts
│   │   │   │   └── rss-feed.module.ts
│   │   │   ├── rss-feed-collection/
│   │   │   │   ├── rss-feed.collection.controller.ts
│   │   │   │   └── rss-feed.collection.module.ts
│   │   │   └── app.module.ts
│   │   └── pipes/
│   │       ├── assign.action.to.agent.dto.transform.pipe.ts
│   │       ├── create.action.dto.transform.pipe.ts
│   │       ├── parse.positive.int.pipe.ts
│   │       └── update.action.dto.transform.pipe.ts
│   ├── utils
│   │   └── string.utils.ts
│   └── main.ts
├── test/
│   ├── e2e/
│   │   ├── action.controller.e2e.spec.ts
│   │   ├── ai-agent.controller.e2e.spec.ts
│   │   ├── article.collection.controller.e2e.spec.ts
│   │   ├── article.controller.e2e.spec.ts
│   │   ├── rss-feed.collection.controller.e2e.spec.ts
│   │   └── rss-feed.controller.e2e.spec.ts
│   └── fixtures/
│       ├── action.fixtures.ts
│       ├── ai-agent.fixtures.ts
│       ├── article.collection.fixtures.ts
│       ├── article.fixtures.ts
│       ├── rss-feed.collection.fixtures.ts
│       └── rss-feed.fixtures.ts
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── jest.setup.js
├── LICENCE
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── tsconfig.test.json
```

### Description of Key Directories and Files

- `application/`: Contains use cases, DTOs, and logic for executing application-specific workflows.
    - `dtos/`: Data Transfer Objects used for input/output validation and data shaping.
    - `schedulers/`: Schedulers responsible for executing periodic or triggered tasks.
    - `usecases/`: Application-specific business logic defining workflows and use cases.
- `domain/`: Core entities and interfaces representing the business models and rules.
    - `entities/`: Domain entities encapsulating core business data and behavior.
    - `interfaces/`: Contracts defining abstractions for domain-level services and repositories.
- `infrastructure/`: Implements the technical details required to support the application.
    - `adapters/`: Adapters for third-party libraries and framework integrations (e.g., logging, parsers).
    - `config/`: Configuration settings and environment-specific utilities.
    - `entities/`: TypeORM entity definitions for database interaction.
    - `mappers/`: Components for transforming data between domain and persistence layers.
    - `repositories/`: Concrete implementations of data access interfaces using TypeORM.
    - `schedulers/`: Infrastructure-level schedulers managing periodic tasks.
    - `services/`: Implementation of services interacting with external APIs or systems.
- `presentation/`: Layer handling user interactions and external API exposure.
    - `modules/`: NestJS modules defining application features and dependency injection boundaries.
    - `pipes/`: Pipes for request validation and transformation within the NestJS framework.
- `test/`: Includes unit tests, integration tests, and end-to-end (E2E) tests.
- `main.ts`: Application entry point, responsible for initializing the server and dependency injection.

## License

This project is licensed under the MIT License.
