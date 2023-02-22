import * as constants from "../constants";
import React, { Fragment, useState, useRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const TaskFormModal = ({ task }) => {
  const getDueDate = () => (task?.due_date ? new Date(task.due_date) : null);

  const [dueDate, setDueDate] = useState(getDueDate());

  const titleRef = useRef();
  const descriptionRef = useRef();
  const priorityRef = useRef();
  const completeRef = useRef();

  const getFormData = () => {
    return {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      priority: priorityRef.current.value,
      is_complete: completeRef.current.checked,
      due_date: dueDate,
      user_id: constants.USER_ID,
    };
  };

  const resetForm = () => {
    console.log("resetForm");
    titleRef.current.value = task?.title || "";
    descriptionRef.current.value = task?.description || "";
    priorityRef.current.value = task?.priority;
    completeRef.current.checked = task?.is_complete;
    setDueDate(getDueDate());
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // create or edit task
    if (task) {
      updateTask(e);
    } else {
      createTask(e);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const body = getFormData();
      console.log("createTask", body);

      const response = await fetch(`${constants.REST_URL}/tasks`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // TODO: ideally we should not reload the page. It resets the sort. We could just update the state on the parent component.
      window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const body = getFormData();
      console.log("updateTask:", body);

      const response = await fetch(`${constants.REST_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // TODO: ideally we should not reload the page. It resets the sort. We could just update the state on the parent component.
      window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target={`#task-id-${task ? task.id : "new"}`}
      >
        {task ? "Edit" : "New Task"}
      </button>

      <div
        className="modal fade"
        id={`task-id-${task ? task.id : "new"}`}
        // onClick={resetForm}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{task ? "Edit Task" : "New Task"}</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={resetForm}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title:</label>
                  <input
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="Enter task title"
                    defaultValue={task?.title || ""}
                    maxLength="200"
                    ref={titleRef}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    rows="3"
                    className="form-control"
                    placeholder="Enter description"
                    maxLength="2000"
                    ref={descriptionRef}
                    defaultValue={task?.description || ""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date:</label>
                  <DatePicker
                    id="dueDate"
                    className="form-control"
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    showTimeSelect
                    dateFormat="MMM dd, yyyy, h:mm aa"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority:</label>
                  <select
                    className="form-control"
                    id="priority"
                    ref={priorityRef}
                    defaultValue={task?.priority}
                  >
                    <option value={3}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={1}>High</option>
                  </select>
                </div>
                <div className="form-group form-check">
                  <label className="form-check-label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      ref={completeRef}
                      defaultChecked={task?.is_complete}
                    />{" "}
                    Complete
                  </label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => onSubmitForm(e)}
              >
                Save
              </button>
              <button
                type="button"
                className="btn"
                data-dismiss="modal"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TaskFormModal;
