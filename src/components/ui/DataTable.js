export default function DataTable(data = [], events) {
  // <tr>
  //               <td class="fw-semibold">EMP-1002</td>
  //               <td>Safety Helmet</td>
  //               <td>18 Jun 2025</td>
  //               <td>
  //                 <span class="badge bg-warning-subtle text-warning">
  //                   Pending
  //                 </span>
  //               </td>
  //               <td class="text-end">
  //                 <button class="btn btn-sm btn-link fw-semibold">
  //                   View
  //                 </button>
  //               </td>
  //             </tr>

  function getStatusBadge(status) {
    const colors = {
      Returned: "bg-success-subtle text-success",
      Pending: "bg-warning-subtle text-warning",
      Overdue: "bg-danger-subtle text-danger",
    }
    return `<span class="badge ${
      colors[status] || "bg-secondary-subtle text-black"
    }">${status}</span>`
  }
  return `
    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
        ${
          data?.length > 0
            ? `
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 position-relative">
              <thead class="table-light sticky-top">
                <tr>
                  <th>Employee</th>
                  <th>Equipment</th>
                  <th>Reservation Date</th>
                  <th>Status</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>

              <tbody id="tablebody">
                ${data
                  .map(
                    (item) => `
                        <tr>
                            <td class="fw-semibold">${item.employeeId}</td>
                            <td>${item.equipment}</td>
                            <td>${item.returnDate}</td>
                            <td>
                                ${getStatusBadge(item.status)}
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-link fw-semibold">
                                View
                                </button>
                            </td>
                        </tr>
                        `
                  )
                  .join("")}
              </tbody> 
            </table>
          </div>`
            : `<div>No records found.</div>`
        }
    
          <!-- footer -->
          <div class="d-flex flex-wrap justify-content-between align-items-center px-3 py-3 border-top">

            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">Rows per page</span>
              <select class="form-select form-select-sm w-auto" data-control="rows">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>

            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item disabled">
                  <a class="page-link" data-action="previous">Previous</a>
                </li>
                <li class="page-item active" data-id="1">
                  <a class="page-link" data-action="pageChange">1</a>
                </li>
                <li class="page-item" data-id="2">
                  <a class="page-link" data-action="pageChange">2</a>
                </li>
                <li class="page-item" data-action="next">
                  <a class="page-link">Next</a>
                </li>
              </ul>
            </nav>

          </div>
        </div>
      </div>
    `
}
