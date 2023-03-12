import React from "react";

export default function ColumnHeadingSortable({
  text,
  field,
  sortTasks,
  sortBy,
  isDate,
}) {
  // display the heading text, plus a sort direction arrow if the column is currently sorted
  const headingText = (text, field, sortBy) => {
    // sortBy is an object {field, desc}
    const sortArrow =
      (sortBy.field === field && (sortBy.desc ? " ↓" : " ↑")) || "";
    return text + sortArrow;
  };

  return (
    <button
      className="btn btn-link btn-sm"
      onClick={() => sortTasks(field, isDate || false)}
    >
      {headingText(text, field, sortBy)}
    </button>
  );
}
