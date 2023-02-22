import React, { Fragment, useEffect, useState } from "react";
import TaskFormModal from "./TaskFormModal";
import ColumnHeadingSortable from "./ColumnHeadingSortable";
import PriorityIcon from "./PriorityIcon";
import * as constants from "../constants";
import * as utils from "../utils";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState({ field: "title", desc: false });

  const getTasks = async () => {
    try {
      const response = await fetch(`${constants.REST_URL}/tasks`);
      const jsonData = await response.json();

      // sort the tasks
      jsonData.sort(utils.sortByProperty(sortBy.field, sortBy.desc));

      setTasks(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // get data to show in the list when the component first renders
  useEffect(() => {
    getTasks();
  }, []);

  const sortTasks = (fieldName, isDate) => {
    // toggle sort order if the currently sorted field is being re-sorted
    sortBy.desc = fieldName === sortBy.field ? !sortBy.desc : false;
    sortBy.field = fieldName;
    setSortBy({ ...sortBy });

    const currentList = [...tasks];

    if (isDate) {
      currentList.sort(utils.sortByPropertyToDate(sortBy.field, sortBy.desc));
    } else {
      currentList.sort(utils.sortByProperty(sortBy.field, sortBy.desc));
    }
    setTasks(currentList);
  };

  const deleteTask = async (id) => {
    try {
      const deleteTask = await fetch(`${constants.REST_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      console.log(
        `toggleComplete - id ${task.id}:
        about to change is_complete to ${!task.is_complete}`
      );
      task.is_complete = !task.is_complete;

      const response = await fetch(`${constants.REST_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      // I guess we don't need to refresh since the user already changed the checkbox
      // It's helpful for development to confirm the change got saved
      // window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th className="text-center">
              <button
                className="btn btn-link btn-sm"
                onClick={() => sortTasks("is_complete")}
              >
                <ColumnHeadingSortable
                  text="Done?"
                  field="is_complete"
                  sortBy={sortBy}
                />
              </button>
            </th>
            <th className="text-center">
              <button
                className="btn btn-link btn-sm"
                onClick={() => sortTasks("priority")}
              >
                <ColumnHeadingSortable
                  text="Priority"
                  field="priority"
                  sortBy={sortBy}
                />
              </button>
            </th>
            <th>
              <button
                className="btn btn-link btn-sm"
                onClick={() => sortTasks("title")}
              >
                <ColumnHeadingSortable
                  text="Task"
                  field="title"
                  sortBy={sortBy}
                />
              </button>
            </th>
            <th>
              <button
                className="btn btn-link btn-sm"
                onClick={() => sortTasks("due_date", true)}
              >
                <ColumnHeadingSortable
                  text="Due Date"
                  field="due_date"
                  sortBy={sortBy}
                />
              </button>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr key={task.id}>
                <td className="text-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={task.is_complete}
                    onChange={() => toggleComplete(task)}
                  />
                </td>
                <td className="text-center">
                  <PriorityIcon priority={task.priority} />
                </td>
                <td>{task.title}</td>
                <td>{utils.formatDateString(task.due_date)}</td>
                <td>
                  <TaskFormModal task={task} />{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default TaskList;
