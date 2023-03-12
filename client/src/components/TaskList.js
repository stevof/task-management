import React, { useEffect, useState, useMemo } from "react";
import SearchBox from "./SearchBox";
import ColumnHeadingSortable from "./ColumnHeadingSortable";
import TaskRow from "./TaskRow";
import TaskFormModal from "./TaskFormModal";
import * as utils from "../utils";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ field: "due_date", desc: false });

  // getTasks only runs when the component first renders
  const getTasks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_URL}/tasks`);
      const jsonData = await response.json();

      // sort the tasks by due date ASC by default
      jsonData.sort(utils.sortByProperty("due_date", false, true));

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
    currentList.sort(utils.sortByProperty(sortBy.field, sortBy.desc, isDate));
    setTasks(currentList);
  };

  const deleteTask = async (id) => {
    try {
      const deleteTask = await fetch(
        `${process.env.REACT_APP_REST_URL}/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

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

      const response = await fetch(
        `${process.env.REACT_APP_REST_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        }
      );

      // I guess we don't need to refresh since the user already changed the checkbox
      // It's helpful for development to confirm the change got saved
      // window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>
              <TaskFormModal />
            </td>
            <td className="d-inline form-inline">
              <SearchBox query={query} setQuery={setQuery} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="table-responsive">
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th className="text-center">
                <ColumnHeadingSortable
                  text="Done?"
                  field="is_complete"
                  sortTasks={sortTasks}
                  sortBy={sortBy}
                />
              </th>
              <th className="text-center">
                <ColumnHeadingSortable
                  text="Priority"
                  field="priority"
                  sortTasks={sortTasks}
                  sortBy={sortBy}
                />
              </th>
              <th>
                <ColumnHeadingSortable
                  text="Task"
                  field="title"
                  sortTasks={sortTasks}
                  sortBy={sortBy}
                />
              </th>
              <th>
                <ColumnHeadingSortable
                  text="Due Date"
                  field="due_date"
                  sortTasks={sortTasks}
                  sortBy={sortBy}
                  isDate={true}
                />
              </th>
              <th>{/* blank heading cell for buttons column*/}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks?.length > 0 ? (
              filteredTasks.map((task) => {
                return (
                  <TaskRow
                    key={task.id}
                    toggleComplete={toggleComplete}
                    task={task}
                    deleteTask={deleteTask}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>
                  <small>No tasks found</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
