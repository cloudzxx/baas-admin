
Baas Admin is a blockchain provision and operation system, which helps manage blockchain networks in an efficient way.

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Main Features](#main-features)
4. [Documentation](#documentation-getting-started-and-develop-guideline)

   
## Introduction

Using Baas Admin, everyone can easily:

* Build up a Blockchain as a Service (Baas) platform quickly from scratch.
* Provision customizable Blockchains instantly, e.g., a Hyperledger fabric network v1.0.
* Maintain a pool of running blockchain networks on top of baremetals, Virtual Clouds (e.g., virtual machines, vsphere Clouds), Container clusters (e.g., Docker, Swarm, Kubernetes).
* Check the system status, adjust the chain numbers, scale resources... through dashboards.

A typical usage scenario is illustrated as:


## Quick Start

Environmental preparation:

1. docker [how install](https://get.docker.com)
2. docker compose(`we switched to` [Docker Compose V2](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command)) [how install](https://docs.docker.com/compose/install/)
3. make `all script for Baas service management is written in Makefile`
4. kubernetes (`optional`) [how install](https://kubernetes.io/docs/setup/)
5. node [how install](https://nodejs.org/en/download/)

If environment is prepared, then we can start Baas service.

* Set local storage environment variable, e.g. Use current path as storage path

  ```bash
  $  export BAAS_STORAGE_PATH=$(pwd)/Baas
  ```


* Start service locally

  ```bash
  $ make local
  ```

* Optional: Build essential images for Baas service (the docker hub image auto build haven't ready, in the future you can ignore this step.)

  * Build docker images
    ```bash
    $ make docker
    ```
  * Then run services locally then

    ```bash
    $ make start
    ```

* After service started up, if use docker-compose method, you can see output:

  ```bash
  CONTAINER ID   IMAGE                            COMMAND                  CREATED         STATUS         PORTS                                                                                  NAMES
  81e6459965ec   Baas/agent-docker   "gunicorn server:app…"   4 seconds ago   Up 2 seconds   0.0.0.0:2375->2375/tcp, :::2375->2375/tcp, 0.0.0.0:5001->5001/tcp, :::5001->5001/tcp   Baas-docker-agent
  04367ab6bd5e   postgres:11.1                    "docker-entrypoint.s…"   4 seconds ago   Up 2 seconds   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp                                              Baas-postgres
  29b56a279893   Baas/api-engine     "/bin/sh -c 'bash /e…"   4 seconds ago   Up 2 seconds   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp                                              Baas-api-engine
  a272a06d8280   Baas/dashboard      "bash -c 'nginx -g '…"   4 seconds ago   Up 2 seconds   80/tcp, 0.0.0.0:8081->8081/tcp, :::8081->8081/tcp                                      Baas-dashboard
  ```

* Stop Baas service.<!---, same as start, need set the `DEPLOY_METHOD` variable.-->

  ```bash
  $ make stop
  ```

* Clean all containers

  ```bash
  $ make clean
  ```

* Check available make rules

  ```bash
  $ make help
  ```

* Visit Baas Admin dashboard at `localhost:8081`


## Technology Stack

### Backend
- **Django 2.1+** - Python web framework
- **Django REST Framework** - RESTful API development
- **PostgreSQL** - Primary database
- **Drf-yasg** - Swagger/OpenAPI documentation

### Frontend
- **TypeScript** - Language
- **React 18** - UI framework
- **Vite 5** - Build tool
- **Ant Design 5** - Component library
- **Tailwind CSS** - Utility CSS framework
- **Zustand** - State management
- **TanStack Query** - Server state & data fetching
- **React Router v6** - Routing
- **react-intl** - Internationalization

### Blockchain Platforms
- **Hyperledger Fabric** - Agent service for Fabric network management
- **FISCO BCOS** - Agent service for FISCO BCOS network management

### Infrastructure
- **Docker & Docker Compose** - Container orchestration
- **Kubernetes** - Orchestration for production deployments
- **Gunicorn** - WSGI application server

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Baas Admin                            │
├─────────────────────────────────────────────────────────────┤
│  Dashboard (React + Ant Design + Tailwind)  │   API Engine (Django) │
│  Port: 8081                        │   Port: 8080          │
├─────────────────────────────────────────────────────────────┤
│                    Agent Services                           │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ Hyperledger     │  │ FISCO           │                 │
│  │ Fabric Agent    │  │ BCOS Agent      │                 │
│  │ Port: 5001      │  │                 │                 │
│  └─────────────────┘  └─────────────────┘                 │
├─────────────────────────────────────────────────────────────┤
│               Worker Nodes (Docker/K8s)                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Fabric  │  │ FISCO   │  │ ...     │                     │
│  │ Nodes   │  │ Nodes   │  │         │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## Main Features

* Manage the lifecycle of blockchains, e.g., create/start/stop/delete/keep health automatically.

* Support customized (e.g., size, consensus) blockchains request, currently we mainly support [Hyperledger fabric](https://github.com/hyperledger/fabric) and [FISCO BCOS](https://github.com/FISCO-BCOS/FISCO-BCOS).

* Support native Docker host, swarm or Kubernetes as the worker nodes. More supports on the way.

* Support heterogeneous architecture, e.g., X86, POWER and Z, from bare-metal servers to virtual machines.

* Extend with monitor, log, health and analytics features by employing additional components.



