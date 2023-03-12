import React from "react";

export default function SearchBox({ query, setQuery, searchRef }) {
  return (
    <>
      {" "}
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
    </>
  );
}
