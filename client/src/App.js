import React, { Fragment } from "react";
import "./App.css";
import TaskFormModal from "./components/TaskFormModal";
import TaskList from "./components/TaskList";

function App() {
  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center mt-5">Task List</h1>
        <TaskFormModal />
        <TaskList />
      </div>
    </Fragment>
  );
}

export default App;
