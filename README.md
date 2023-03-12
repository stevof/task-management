# Task Management

## Prerequisites

1. Docker Desktop
1. Node.js (tested with v18.12, but other versions will likely work)
1. nodemon

## Setup

Clone this repo, start a Terminal in the project folder, then...

### Database and API

`cd server`

`npm install`

Start Docker Desktop

From project root folder, run `docker compose up -d`

Starting the docker container should create a PostgreSQL user 'tasks' with password 'tasks', and a database named tasks. It should also run ./server/database.sql to create the necessary objects. Assuming this all works correctly, you should not have to do anything else to set up the database.

### Web Client

`cd client`

`npm install`

## Run the App

### Start the API

Start a new Terminal and run:

`cd server`

`nodemon index`

### Start the Web Client

Start a new Terminal and run:

`cd client`

`npm start`

It should open a browser tab to http://localhost:3000/
