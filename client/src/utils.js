export function sortByProperty(property, sortDesc, isDate = false) {
  return function (a, b) {
    let first = sortDesc ? b : a;
    let second = sortDesc ? a : b;

    let firstVal = first[property];
    let secondVal = second[property];

    if (isDate) {
      firstVal = firstVal ? new Date(firstVal) : null;
      secondVal = secondVal ? new Date(secondVal) : null;
    } else if (typeof firstVal === "string" || typeof secondVal === "string") {
      // ignore case for strings
      firstVal = firstVal?.toLowerCase();
      secondVal = secondVal?.toLowerCase();
    }

    if (firstVal > secondVal) return 1;
    else if (firstVal < secondVal) return -1;

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
