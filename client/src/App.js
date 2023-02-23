import React, { Fragment } from "react";
import "./App.css";
import TaskList from "./components/TaskList";

function App() {
  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center mt-5">Task List</h1>
        <TaskList />
      </div>
    </Fragment>
  );
}

export default App;
