import mockApi from "@/utils/mockApi"
import DataTable from "@/components/ui/DataTable"

export default function EquipmentList() {
  //  <div class="col-md-3">
  //   <label class="form-label fw-semibold">Status</label>
  //   <select class="form-select">
  //     <option value="">All statuses</option>
  //     <option>Returned</option>
  //     <option>Pending</option>
  //     <option>Overdue</option>
  //   </select>
  // </div>
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
                    <i class="bi bi-calendar-event"></i>
                  </span>
                  <input type="date" class="form-control" />
                </div>
              </div>
            </div>

            <!-- Status checkboxes -->
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

      <div id="dataTable">
        ${DataTable([])}
      </div>
      
      <div id="loader">Loading..</div>
    </div>
  `
}

export async function mounted() {
  const loaderElement = document.getElementById("loader")
  // const tableBodyElement = document.getElementById("tableBody")
  const emptyState = document.getElementById("empty-state")
  const dataTable = document.getElementById("dataTable")
  // const tablebody = document.getElementById("tablebody")

  // setTimeout(() => {
  //   console.log("before", tablebody);
  //   dataTable.innerHTML = DataTable();
  // }, 3000);

  // setTimeout(() => {
  //   console.log("after", tablebody);
  // }, 5000);

  console.log("loaderElement2", loaderElement)

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
    console.error(
      "failed to fetch Equipment History. Please try again later ",
      err
    )
  } finally {
    loaderElement?.classList.add("d-none")
  }
}
