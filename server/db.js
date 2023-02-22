const { Pool } = require("pg");

const pool = new Pool({
  user: "tasks",
  password: "tasks",
  host: "localhost",
  port: 5432,
  database: "tasks",
});

module.exports = pool;
