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

**RSS Feed Manager** is a RESTful API built with Node.js and TypeScript, designed to manage RSS feeds and organize them
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
│   │   ├── dtos/
│   │   │   ├── rss-feed.collection.dto.ts
│   │   │   └── rss-feed.dto.ts
│   │   └── scheduler/
│   │       └── parse.feed.scheduler.ts
│   │   └── usecases/
│   │       ├── rss-feed.collection.use-cases.ts
│   │       └── rss-feed.use-cases.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── article.ts
│   │   │   ├── media.attachment.ts
│   │   │   ├── rss-feed.collection.ts
│   │   │   └── rss-feed.ts
│   │   └── interfaces/
│   │       ├── article.repository.ts
│   │       ├── base.collection.ts
│   │       ├── entity.ts
│   │       ├── item.parser.ts
│   │       ├── logger.ts
│   │       ├── parser.output.ts
│   │       ├── repository.ts
│   │       ├── rss-parser.ts
│   │       └── usecases.ts
│   ├── infrastructure/
│   │   ├── Config/
│   │   │   └── database.config.ts
│   │   ├── entities/
│   │   │   ├── article.entity.ts
│   │   │   ├── media.attachment.entity.ts
│   │   │   ├── index.ts
│   │   │   ├── rss-feed.collection.entity.ts
│   │   │   └── rss-feed.entity.ts
│   │   ├── mappers/
│   │   │   ├── article.mapper.ts
│   │   │   ├── media.attachment.mapper.ts
│   │   │   ├── rss-feed.collection.mapper.ts
│   │   │   └── rss-feed.mapper.ts
│   │   ├── repositories/
│   │   │   ├── article.repository.ts
│   │   │   ├── rss-feed.collection.repository.ts
│   │   │   └── Rrss-feed.repository.ts
│   │   ├── schedulers/
│   │   │   └── schedule.module.ts
│   │   ├── services/
│   │   │   └── rss-parser.service.ts
│   │   ├── infrastructure.module.ts
│   │   └── nest-logger.adapter.ts
│   ├── presentation/
│   │   ├── modules/
│   │   │   ├── rss-feed/
│   │   │   │   ├── rss-feed.controller.ts
│   │   │   │   └── rss-feed.module.ts
│   │   │   ├── rss-feed-collection/
│   │   │   │   ├── rss-feed.collection.controller.ts
│   │   │   │   └── rss-feed.collection.module.ts
│   │   │   └── app.module.ts
│   │   └── pipes/
│   │       └── parse.positive.int.pipe.ts
│   └── main.ts
├── test/
│   ├── e2e/
│   │   ├── rss-feed.collection.controller.e2e.spec.ts
│   │   └── rss-feed.controller.e2e.spec.ts
│   └── fixtures/
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

- `application/`: Contains use cases, DTOs, and interfaces defining the business logic and contracts.
- `domain/`: Core entities representing the business models.
    - `entities/`: Domain entities representing the core business objects.
- `infrastructure/`:
    - `config/`: Configuration settings and utilities.
    - `database/`: TypeORM DataSource configuration.
    - `entities/`: TypeORM entity definitions for database interaction.
    - `mappers/`: Transformations between domain and database entities.
    - `repositories/`: Data access layer interfacing with TypeORM.
- `presentation/`:
    - `controllers/`: Express controllers handling HTTP requests and responses.
    - `pipes/`: Express controllers handling HTTP requests and responses.
- `tests/`: Includes E2E tests.
- `main.ts`: Application entry point, initializing the server and dependencies.

## License

This project is licensed under the MIT License.
