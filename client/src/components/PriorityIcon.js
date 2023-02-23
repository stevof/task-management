export default function PriorityIcon({ priority }) {
  let icon, title;

  if (priority === 1) {
    icon = "⇑";
    title = "high";
  } else if (priority === 2) {
    icon = "⇔";
    title = "medium";
  } else if (priority === 3) {
    icon = "⇓";
    title = "low";
  }

  // it should really always be one of the values above

  return <span title={title}>{icon}</span>;
}
