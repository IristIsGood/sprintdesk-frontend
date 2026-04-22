
# 🚀 SprintDesk — Java Task Management Platform

SprintDesk is a task management system designed to streamline project tracking and team collaboration. Built with a modern Java stack, it demonstrates enterprise-level architecture, cloud-native deployment, and optimized data strategies.

## 🎯 Problem & Solution
* **Problem:** Legacy project management tools often suffer from rigid schemas for activity logging and performance bottlenecks during heavy data retrieval.
* **Solution:** Implemented a hybrid database approach using PostgreSQL for structured relational data and MongoDB for flexible activity logs. Integrated Redis caching and optimized JPA queries to ensure sub-second response times.

## 🏗️ Technical Architecture & Pipeline

The system follows a clean-layered architecture with a automated CI/CD pipeline:
1.  **Frontend:** React + TypeScript consumer.
2.  **Backend:** Spring Boot REST API.
3.  **Persistence:** PostgreSQL (Primary), Redis (Cache), MongoDB (Logs).
4.  **DevOps:** GitHub Actions automates testing and containerization; Docker images are deployed to AWS EC2 with RDS.

## ✨ Key Features
* **Secure Authentication:** Implemented stateless JWT-based security with BCrypt password hashing.
* **Kanban Workflow:** Supports full Project/Task CRUD with status transitions (To Do, In Progress, Done).
* **Audit Trail:** Tracks every user action via a non-blocking MongoDB activity logging service.
* **Performance Optimization:** Utilizes Spring Cache and optimized JPQL to mitigate common ORM overhead.

## 🛠️ Tech Stack
* **Backend:** Java 17, Spring Boot 3, Spring Security, JPA/Hibernate.
* **Databases:** PostgreSQL, MongoDB, Redis.
* **Frontend:** React 18, TypeScript, Axios, Tailwind CSS.
* **DevOps:** Docker, AWS (EC2/RDS), GitHub Actions, Maven.

## 🚀 Getting Started

### Prerequisites
* JDK 17+
* Docker & Docker Compose
* Maven

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/sprintdesk.git](https://github.com/your-username/sprintdesk.git)
    ```
2.  **Start Infrastructure (DBs/Cache):**
    ```bash
    docker-compose up -d
    ```
3.  **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```

## 🔑 Key Technical Decisions
* **Hybrid Storage:** Chose MongoDB for activity logs to accommodate varying data structures without requiring frequent SQL migrations.
* **Query Optimization:** Resolved JPA N+1 issues using `JOIN FETCH` strategy, reducing database round-trips by up to 80% on project listing endpoints.
* **Global Exception Handling:** Centralized error management using `@RestControllerAdvice` to ensure consistent API responses and simplify frontend error parsing.
* **Stateless Security:** Decoupled session management from the server using JWT, allowing for horizontal scaling of the backend services.

## 📁 Project Structure
```text
sprintdesk/
├── src/main/java/com/sprintdesk/
│   ├── config/             # Security, Redis, and Mongo configurations
│   ├── controller/         # REST API endpoints
│   ├── service/            # Business logic and transaction management
│   ├── repository/         # JPA/Mongo data access layers
│   ├── entity/             # Persistent data models
│   ├── dto/                # Data transfer objects (Requests/Responses)
│   └── exception/          # Custom exceptions and global handler
├── src/main/resources/     # Application properties and SQL scripts
├── .github/workflows/      # CI/CD pipeline definitions
└── docker-compose.yml      # Local dev environment setup
```

## 🛡️ License
MIT

## 👤 Developer
**Irist** – Building tools that turn raw market data into trading intelligence.
```
