# Pygus API

API of the Pygus app developed with Node and Express with Mongo as database.

- [Running the project](#running-the-project)
  - [Prerequisites](#prerequisites)
  - [Instalation](#instalation)
  - [Environment variables](#environment-variables)
  - [Start](#start)
- [Project structure](#project-structure)
  - [/controllers](#controllers)
  - [/middleware](#middleware)
  - [/models](#models)
  - [/public](#public)
  - [/routes](#routes)
  - [/node_modules](#node_modules)
- [/Endpoints](#endpoints)
  - [/users](#users)
  - [/auth](#auth)
  - [/tasks](#tasks)
- [Author](#author)

## Running the project

Follow the instructions below to copy the project and run locally.

### Prerequisites

As prerequisites to run the project is needed to have Node.js, the package manager NPM and MongoDB installed in you machine.

### Instalation

Clone the project with the command:

```sh
$ git clone https://github.com/alexisbarros/pygus-api.git
```

Go to the created folder:

```sh
$ cd pygus-api
```

Install all dependencies:

```sh
$ npm install
```

### Environment variables

Create a .env file and use the .env-example file to set the enviroment variables.

### Start

Start the project using expo cli:

```sh
$ node index.js
```

## Project structure

The project is structured as follows:

```
pygus-api/
  controllers/
  middleware/
  models/
  node_modules/
  public/
  routes/
  .env
  index.js
  package.json
  README.md
```

Below is a breakdown of some project directories.

### /controllers

Contains all controllers files of the project.

### /middleware

Contains all middleware files of the project.

### /models

Contains all models files responsable to create the collections in mongodb.

### /public

Contains all the images and sounds.

### /routes

Contains all routes files of the project.

### /node_modules

Contains all the modules installed by NPM.

## Endpoints

### /users

CRUD users.

### /auth

/register signin a user.

/login login a user.

/login-admin login a admin user.

### /tasks

CRUD tasks.

## Author

Alexis Barros
