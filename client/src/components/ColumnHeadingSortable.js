// display the heading text, plus a sort direction arrow if the column is currently sorted
//
const ColumnHeadingSortable = ({ text, field, sortBy }) => {
  // props: text, field, sortBy {field, desc}
  const sortArrow =
    (sortBy.field === field && (sortBy.desc ? " ↓" : " ↑")) || "";
  return text + sortArrow;
};

export default ColumnHeadingSortable;
