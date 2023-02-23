import React, { Fragment, useEffect, useState, useRef } from "react";
import TaskFormModal from "./TaskFormModal";
import ColumnHeadingSortable from "./ColumnHeadingSortable";
import PriorityIcon from "./PriorityIcon";
import * as constants from "../constants";
import * as utils from "../utils";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [sortBy, setSortBy] = useState({ field: "due_date", desc: false });
  const searchRef = useRef();

  // getTasks only runs when the component first renders
  const getTasks = async () => {
    try {
      const response = await fetch(`${constants.REST_URL}/tasks`);
      const jsonData = await response.json();

      // sort the tasks by due date ASC by default
      jsonData.sort(utils.sortByPropertyToDate("due_date", false));

      // this is the tasks bound to the list
      setTasks(jsonData);

      // save the original set of tasks for searching. this allows instant client-side searching
      // without calling the server
      // TODO: we could extract out only the attributes we need for searching (title, description),
      // to reduce duplicate data saved in state.
      setAllTasks(jsonData);
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
        `toggleComplete - changed id ${
          task.id
        } is_complete to ${!task.is_complete}`
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

  const searchTasks = (reset) => {
    if (reset) {
      searchRef.current.value = null;
      setTasks(allTasks);
      return;
    }
    const searchFor = searchRef.current.value;

    // search through the full original list of tasks we got from the server.
    // this allows user to revise/clear the search without calling back to the server
    const results = allTasks.filter(
      (task) =>
        task.title.includes(searchFor) || task.description.includes(searchFor)
    );
    setTasks(results);
  };

  return (
    <Fragment>
      <table className="">
        <tbody>
          <tr>
            <td>
              <TaskFormModal />
            </td>
            <td className="d-inline form-inline">
              <input
                type="text"
                className="form-control m-1"
                placeholder="Search"
                onChange={() => searchTasks()}
                ref={searchRef}
              ></input>
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={() => searchTasks(true)}
              >
                clear
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-striped mt-3">
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
                <td>
                  {task.title}
                  {task.description ? (
                    <>
                      <br />
                      <em className="small">
                        {task.description.substring(0, 40)}
                      </em>
                    </>
                  ) : null}
                </td>
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
}
