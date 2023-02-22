# Task Management

## Prerequisites

Docker
Node.js (tested with v18.12, but other versions will likely work)
nodemon (?)

## Setup

### Database

`cd server`
`npm install`

From ptoject root folder, run `docker-compose -f docker-compose.yml up -d`

Run db migrations....?

- TODO: use node-pg-migrate, or docker copy to container (special postgres dir)

- TODO: need to create a user record

`DATABASE_URL=postgres://tasks:tasks@localhost:5432/tasks npm run migrate up`

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
