export default function StatusBadge(status) {
  const colors = {
    Returned: "bg-success-subtle text-success",
    Pending: "bg-warning-subtle text-warning",
    Overdue: "bg-danger-subtle text-danger",
  }
  return `<span class="badge ${
    colors[status] || "bg-secondary-subtle text-black"
  }">${status}</span>`
}
