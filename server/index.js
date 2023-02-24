const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json()); // req.body

// ROUTES //

// create a task

app.post("/tasks", async (req, res) => {
  try {
    console.log("POST /tasks", req.body);

    const { user_id, title, description, priority, is_complete, due_date, reminder_date } =
      req.body;
    const newTask = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, is_complete, due_date, reminder_date)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [user_id, title, description, priority, is_complete, due_date, reminder_date]
    );

    res.json(newTask.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// get all tasks

app.get("/tasks", async (req, res) => {
  try {
    console.log("GET /tasks");

    const allTasks = await pool.query(
      `SELECT id, title, description, priority, is_complete, due_date, reminder_date, created_date, user_id
      FROM tasks`
    );
    res.json(allTasks.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get a task

app.get("/tasks/:id", async (req, res) => {
  try {
    console.log("GET /tasks/:id", req.params);

    const { id } = req.params;
    const task = await pool.query(
      `SELECT id, title, description, priority, is_complete, due_date, reminder_date, created_date, user_id
      FROM tasks
      WHERE id = $1`,
      [id]
    );

    res.json(task.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// update a task

app.put("/tasks/:id", async (req, res) => {
  try {
    console.log("PUT /tasks/:id", req.params, req.body);

    const { id } = req.params;
    const data = req.body;
    const updateTask = await pool.query(
      `UPDATE tasks
      SET user_id = $2, title = $3, description = $4, priority = $5, is_complete = $6, due_date = $7, reminder_date = $8
      WHERE id = $1`,
      [
        id,
        data.user_id,
        data.title,
        data.description,
        data.priority,
        data.is_complete,
        data.due_date,
        data.reminder_date,
      ]
    );

    res.json(`task ${id} was updated: ${data.title}`);
  } catch (error) {
    console.error(error.message);
  }
});

// delete a task

app.delete("/tasks/:id", async (req, res) => {
  try {
    console.log("DELETE /tasks/:id", req.params);

    const { id } = req.params;
    const deleteTask = await pool.query("DELETE FROM tasks WHERE id = $1", [
      id,
    ]);

    res.json(`task ${id} was deleted`);
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
