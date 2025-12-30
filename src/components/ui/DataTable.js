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

  const mobileSort = `
    <div class="d-md-none mx-2 my-2 p-3 rounded-3 border bg-light">
      
      <!-- title -->
      <div class="d-flex align-items-center gap-2 mb-2">
        <i class="bi bi-funnel-fill"></i>
        <span class="fw-semibold">Sort options</span>
      </div>

      <!-- sort by -->
      <label for="mobileSort" class="form-label small mb-1">
        <i class="bi bi-list-ul me-1"></i>
        Sort by
      </label>

      <select
        class="form-select form-select-sm mb-3"
        id="mobileSort"
        data-control="mobile-sort"
        aria-label="Select sort field"
      >
        <option value="">Choose field…</option>
        ${columns
          .filter(col => col.sortable)
          .map(
            item => `<option value="${item.key}">
              ${item.header}
            </option>`
          )
          .join("")}
      </select>

      <!-- order -->
      <label for="mobileOrder" class="form-label small mb-1">
        <i class="bi bi-arrow-down-up me-1"></i>
        Order
      </label>

      <select
        class="form-select form-select-sm"
        id="mobileOrder"
        data-control="mobile-order"
        aria-label="Select sort direction"
      >
        <option value="">Choose order…</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  `;

  return `
    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
        ${
          items?.length
            ? `
            <div class="table-responsive">
              ${mobileSort}
              <table class="table table-hover align-middle mb-0 position-relative">

                <!--- header --->
                <thead class="table-light sticky-top">
                  <tr>
                    ${columns
                      .map(
                        (col) => `<th class="text-capitalize ${
                          col.headerClass ?? ''
                        }" data-sort-by="${col.sortable ? col.key : ''}" data-action="sort">
                        <button class="default-btn ${col.sortable ? '' : 'disabled'}" aria-label="Sort by ${col.header}">             
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
              ? `<div class="d-flex flex-wrap gap-2 justify-content-between align-items-center px-3 py-3 border-top">

            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">Rows per page</span>
              <select class="form-select form-select-sm w-auto" data-control="rows" id="rowsPerPage" aria-label="Select rows per page count">
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
