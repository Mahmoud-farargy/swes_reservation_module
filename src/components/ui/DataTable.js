export default function DataTable({
  columns = [],
  items = [],
  emptyMessage = "No records found.",
  currentPage = 1,
  rowsPerPage = 10,
  totalPages = 1,
  showFooter = true,
}) {
  const renderCell = (row, column) => {
    if (typeof column.render === "function") {
      return column.render(row[column.key], row)
    }
    return row[column.key] ?? "-"
  }

  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  const pageNumbers = Array.from({ length: totalPages })

  return `
    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
        ${
          items?.length
            ? `
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 position-relative">

                <!--- header --->
                <thead class="table-light sticky-top">
                  <tr>
                    ${columns
                      .map(
                        (col) => `<th class="text-capitalize ${
                          col.headerClass ?? ""
                        }" data-sort-by="${col.key}" data-action="sort">
                        <button class="default-btn" aria-label="Sort by ${col.header}">             
                          ${col.header}
                          <span class="sort-indicator"></span>
                        </button>
                      </th>`
                      )
                      .join("")}
                  </tr>
                </thead>

                <!--- body --->
                <tbody>
                  ${items
                    .map(
                      (row) => `
                        <tr>
                          ${columns
                            .map(
                              (col) => `
                                <td class="${col.cellClass ?? ""}">
                                  ${renderCell(row, col)}
                                </td>
                              `
                            )
                            .join("")}
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>

              </table>
            </div>`
            : `<div class="px-3 py-4">${emptyMessage}</div>`
        }
    
          <!--- footer --->
          ${
            showFooter
              ? `<div class="d-flex flex-wrap justify-content-between align-items-center px-3 py-3 border-top">

            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">Rows per page</span>
              <select class="form-select form-select-sm w-auto" data-control="rows" id="rowsPerPage">
                <option value="10" ${
                  rowsPerPage === 10 ? "selected" : ""
                }>10</option>
                <option value="25" ${
                  rowsPerPage === 25 ? "selected" : ""
                }>25</option>
                <option value="50" ${
                  rowsPerPage === 50 ? "selected" : ""
                }>50</option>
              </select>
            </div>

            <nav>
              <ul class="pagination pagination-sm mb-0">     
              <!-- previous btn -->          
                <li>
                  <button class="default-btn page-item ${
                    !hasPrevPage ? "disabled" : ""
                  }" data-action="prev" data-page="${currentPage - 1}" aria-label="Previous page">
                    <a class="page-link">Previous</a>
                  </button>
                </li>
                ${pageNumbers
                  .map((_, index) => {
                    const pageNum = index + 1
                    const isPageActive = pageNum === +currentPage
                    return `
                      <li>
                        <button class="default-btn page-item ${
                          isPageActive ? "active" : ""
                        }" data-page="${pageNum}">
                          <a class="page-link rounded-0" data-action="pageChange" aria-label="Go to page ${pageNum}">${pageNum}</a>
                        </button>
                      </li>
                    `
                  })
                  .join("")}
                <!-- next btn -->
                <li>
                  <button class="default-btn page-item ${
                    !hasNextPage ? "disabled" : ""
                  }" data-action="next" data-page="${currentPage + 1}" aria-label="Next page">
                    <a class="page-link">Next</a>
                  </button>
                </li>
              </ul>
            </nav>

          </div>
          `
              : ""
          }
        </div>
      </div>
    `
}
