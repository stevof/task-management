export function sortByProperty(property, sortDesc) {
  return function (a, b) {
    const first = sortDesc ? b : a;
    const second = sortDesc ? a : b;

    if (first[property] > second[property]) return 1;
    else if (first[property] < second[property]) return -1;

    return 0;
  };
}

export function sortByPropertyToDate(property, sortDesc) {
  return function (a, b) {
    const first = sortDesc ? b : a;
    const second = sortDesc ? a : b;

    // convert to Date so sorting will work
    const firstDate = first[property] ? new Date(first[property]) : null;
    const secondDate = second[property] ? new Date(second[property]) : null;

    if (firstDate > secondDate) return 1;
    else if (firstDate < secondDate) return -1;

    return 0;
  };
}

export function formatDateString(dateString) {
  if (dateString) {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  return "";
}
