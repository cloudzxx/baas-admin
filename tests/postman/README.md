# Postman API Testing

This directory contains Postman test collections and Newman automation testing configuration for FXBaaS Admin API Engine.

## Features

- **BaaS Admin Api Engine.postman_collection.json**: Complete API test collection with all RESTful endpoints
- **BaaS Admin Engine CI Test.postman_collection.json**: Streamlined test collection for CI/CD

### Test Coverage
- 🔐 User Authentication (login, registration, token verification)
- 🤖 Agent Management (Docker/Kubernetes agents)
- 🏢 Organization Management
- 🌐 Network Management
- 🖥️ Node Management (Peer/Orderer)
- 📡 Channel Management
- 📦 Chaincode Management
- 👥 User Management
- 📁 File Management

## Newman Usage

### 1. Using Makefile Commands
```bash
# Run API tests
make check-api
```

### 2. Using Docker Compose
```bash
# Navigate to test directory
cd tests/postman

# Run tests
docker compose up --abort-on-container-exit
```

## Configuration

### Environment Variables
Tests use internally defined collection variables:
- `base_url`: API base URL (default: http://127.0.0.1:8080)
- `token`: JWT access token
- Other business-related variables (org_id, agent_id, etc.)

### Test Reports
- **JUnit Format**: `junitResult.xml` - for CI/CD integration
- **CLI Output**: Real-time console test results