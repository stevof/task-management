import React from "react";
import TaskFormModal from "./TaskFormModal";
import PriorityIcon from "./PriorityIcon";
import * as utils from "../utils";

export default function TaskRow({ task, toggleComplete, deleteTask }) {
  return (
    <tr>
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
            <em className="small">{task.description.substring(0, 40)}</em>
          </>
        ) : null}
      </td>
      <td>{utils.formatDateString(task.due_date)}</td>
      <td>
        <TaskFormModal task={task} />{" "}
        <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
