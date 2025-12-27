import mockApi from "@/utils/mockApi"
import { DataTable, LoaderSpinner } from "@/components/ui"
import DataTableFilters, { mountFilters } from "@/components/ReservationFilters"
import {
  toastify,
  refreshApp,
  urlToObject,
  objectToUrl,
  getCurrentSearchParams,
} from "@/utils/helpers"

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

      <div id="filters">
        ${DataTableFilters()}
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
  // ---- constants ----
  const dataTable = document.getElementById("dataTable")
  const filters = document.getElementById("filters")

  // ---- DataTable - on click event listener ----
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

  const reloadBtnEventController = new AbortController()

  const fetchEquipmentList = async (page = 1, extraParams = {}) => {
    try {
      const currentParams = urlToObject(getCurrentSearchParams())
      const mergedParams = {
        ...currentParams,
        ...extraParams,
        page,
      }
      const url = objectToUrl(
        new URLSearchParams(mergedParams),
        "/api/equipment-history"
      )
      const response = await mockApi(url)
      const result = await response.json()

      dataTable.innerHTML = DataTable(result.data)
      reloadBtnEventController.abort()
    } catch (err) {
      console.error(err)
      dataTable.innerHTML = `<div class="my-4 text-center">
              An error occurred. Try again later! <button data-action="reload" class="btn btn-dark mt-1">Reload</button>
          <div>`

      dataTable.addEventListener(
        "click",
        (e) => {
          if (e.target.matches('[data-action="reload"]')) {
            refreshApp()
          }
        },
        { signal: reloadBtnEventController.signal }
      )

      toastify({
        type: "error",
        message: "Failed to fetch Equipment History. Please try again later.",
      })
    }
  }

  // ------ Init -------
  mountFilters(filters)
  fetchEquipmentList()
}
