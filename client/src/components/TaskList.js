import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import TaskFormModal from "./TaskFormModal";
import ColumnHeadingSortable from "./ColumnHeadingSortable";
import PriorityIcon from "./PriorityIcon";
import * as constants from "../constants";
import * as utils from "../utils";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ field: "due_date", desc: false });
  const searchRef = useRef();

  // getTasks only runs when the component first renders
  const getTasks = async () => {
    try {
      const response = await fetch(`${constants.REST_URL}/tasks`);
      const jsonData = await response.json();

      // sort the tasks by due date ASC by default
      jsonData.sort(utils.sortByPropertyToDate("due_date", false));

      // this is the full, unfiltered list of tasks
      setTasks(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // get data to show in the list when the component first renders
  useEffect(() => {
    getTasks();
  }, []);

  // filteredTasks is the list of tasks shown in the UI, derived from the full tasks state.
  // useMemo so it's cached, and we don't need to store it in state.
  // update it when the main list of tasks changes, or the search query changes
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [tasks, query]);

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
                type="search"
                className="form-control m-1"
                placeholder="Search"
                value={query}
                onChange={() => setQuery(searchRef.current.value)}
                ref={searchRef}
              ></input>
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={() => setQuery("")}
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
          {filteredTasks.map((task) => {
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
