import React from "react";

export default function SearchBox({ query, setQuery }) {
  return (
    <>
      {" "}
      <input
        type="search"
        className="form-control m-1"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      <button
        type="button"
        className="btn btn-link btn-sm"
        onClick={() => setQuery("")}
      >
        clear
      </button>
    </>
  );
}
