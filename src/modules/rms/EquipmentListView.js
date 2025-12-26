import mockApi from "@/utils/mockApi"
import DataTable from "@/components/ui/DataTable"
import { LoaderSpinner } from "@/components/ui/LoaderSpinner"
import { toastify } from "@/utils/helpers"

export default function EquipmentList() {

  return `
    <div class="my-3">
      <!-- Page Header -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 class="fw-bold mb-1">Equipment History</h3>
          <p class="text-muted mb-0">Overview of reserved equipment</p>
        </div>

        <a href="/make_reservation" data-link class="btn btn-dark">
          + New Reservation
        </a>
      </div>

      <!-- Filters -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row flex-wrap g-4 align-items-end">
            <!-- Search -->
            <div class="col-md-6 col-xl-4">
              <label class="form-label fw-semibold">Search</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search by employee or item"
                />
              </div>
            </div>
            <!-- Equipment -->
            <div class="col-md-6 col-xl-4">
                <label class="form-label fw-semibold">Equipment</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-tags"></i>
                  </span>
                  <select class="form-select">
                    <option value="">All Equipment Categories</option>
                    <option>Helmet</option>
                    <option>Boots</option>
                    <option>Gloves</option>
                  </select>
                </div>
            </div>
            <!-- Date range -->
            <div class="col-md-6 col-xl-4">
              <label class="form-label fw-semibold">Reservation Date</label>
              <div class="d-flex gap-2">
                <div class="input-group">
                  <span class="input-group-text">
                     <i class="bi bi-calendar-event"></i>
                  </span>
                  <input type="date" class="form-control" />
                </div>

                <div class="input-group">
                  <span class="input-group-text">
                     <i class="bi bi-arrow-right"></i>
                  </span>
                  <input type="date" class="form-control" />
                </div>
              </div>
            </div>
            <!-- Status -->
            <div class="col-md-6 col-xl-4">
              <label class="form-label fw-semibold d-block mb-2">Status</label>
              <div class="d-flex flex-wrap gap-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="statusReturned"
                    checked
                  />
                  <label class="form-check-label" for="statusReturned">
                    Returned
                  </label>
                </div>

                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="statusPending"
                    checked
                  />
                  <label class="form-check-label" for="statusPending">
                    Pending
                  </label>
                </div>

                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="statusOverdue"
                  />
                  <label class="form-check-label" for="statusOverdue">
                    Overdue
                  </label>
                </div>
              </div>
            </div>

            <!-- Actions row -->
            <div class="col-md-6 col-xl-4 ms-auto">
              <div class="d-flex justify-content-end">
                <button class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>
                  Reset filters
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div id="dataTable" class="position-relative">
        <div class="pt-5 pb-2">
          ${LoaderSpinner()}
        </div>
      </div>

    </div>
  `
}

export async function mounted() {
  const dataTable = document.getElementById("dataTable")

  // DataTable: on click event listener
  dataTable.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action
    if (!action) return

    switch (action) {
      case "view": {
        const id = e.target.closest("tr")?.dataset.id
        console.log("id", id)
        break
      }
      case "pageChange": {
        const id = e.target.closest("li")?.dataset.id
        console.log("id", id)
        break
      }
      case "next":
        console.log("next")
        break
      case "prev":
        console.log("prev")
        break
    }
  })

  try {
    const response = await mockApi("/api/equipment-history")
    const result = await response.json()

    dataTable.innerHTML = DataTable(result.data)
  } catch (err) {
    console.error(err)
    dataTable.innerHTML = `<div class="my-4 text-center">An error occurred. Try again later!<div>`
    toastify({
      type: "error",
      message: "failed to fetch Equipment History. Please try again later."
    })
  }
}
