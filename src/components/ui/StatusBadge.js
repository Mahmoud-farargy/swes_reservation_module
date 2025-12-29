export default function StatusBadge(status) {
  const colors = {
    Returned: "bg-success bg-opacity-75 text-white",
    Pending: "bg-warning bg-opacity-75 text-dark",
    Overdue: "bg-danger bg-opacity-75 text-white",
  }
  const icons = {
    Returned: "bi-check-circle-fill",
    Pending: "bi-clock-fill",
    Overdue: "bi-exclamation-triangle-fill",
  }
  const colorClass = colors[status] || "bg-secondary-subtle text-black"
  const iconClass = icons[status] ? `<i class="bi ${icons[status]} me-1"></i>` : ""

  return `<span class="badge ${colorClass} d-inline-flex align-items-center px-3 py-1 fw-semibold">
      ${iconClass}${status}
    </span>`
}
