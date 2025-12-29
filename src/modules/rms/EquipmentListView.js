import mockApi from "@/utils/mockApi"
import { DataTable, LoaderSpinner, StatusBadge } from "@/components/ui"
import DataTableFilters, {
  mountFilters,
} from "@/components/ReservationFiltersPanel"
import { router } from "@/router"
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
  // ---- Table Headers ----
  const columns = Object.freeze([
    {
      header: "Date",
      key: "date",
      sortable: true,
    },
    {
      header: "Employee",
      key: "employeeId",
      headerClass: "fw-semibold",
      sortable: true,
    },
    {
      header: "Equipment",
      key: "equipmentName",
      sortable: true,
    },
    {
      header: "Reservation Date",
      key: "reservationDate",
      sortable: true,
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (value) => StatusBadge(value),
    },
    {
      header: "Action",
      key: "action",
      headerClass: "text-end",
      cellClass: "text-end",
      sortable: false,
      render: (_, row) => `
        <button 
          class="btn btn-sm btn-dark fw-semibold" 
          data-action="view" 
          data-id="${row.id}"
          aria-label="View reservation ${row.id}"
        >
          View
        </button>
      `,
    },
  ])

  // ---- constants ----
  const dataTable = document.getElementById("dataTable")
  const filters = document.getElementById("filters")

  const reloadBtnEventController = new AbortController()
  const currentSearchParams = getCurrentSearchParams()

  // ---- Functions ----
  const fetchEquipmentList = async () => {
    const currentQuery = urlToObject(currentSearchParams)

    try {
      const url = objectToUrl(
        new URLSearchParams(currentQuery),
        "/api/equipment-history"
      )
      const response = await mockApi(url)

      if (!response.ok) {
        const errorData = await response.json?.();
        toastify({ type: "error", message: errorData || "Submission Failed" })
        return
      }
      const result = await response.json()

      // console log is left intentionally
      console.log("Equipment List: ", result);
      const { data, pagination } = result || {}
      dataTable.innerHTML = DataTable({
        columns,
        items: data,
        emptyMessage: "No records found.",
        currentPage: pagination.currentPage,
        rowsPerPage: pagination.pageSize,
        totalPages: pagination.totalPages,
      })
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

  const replaceSearchParams = (updatedParams) => {
    if (!updatedParams) return
  
    if (+updatedParams.get("page") === 1) {
      updatedParams.delete("page")
    }

    const url = objectToUrl(new URLSearchParams(updatedParams))

    router.replace(url)
  }

  // ---- DataTable - event listeners ----
  dataTable.addEventListener("click", (e) => {
    const element = e.target.closest("[data-action]")
    if (!element) return
    const action = element.dataset.action

    switch (action) {
      case "view": {
        const id = element.dataset.id
        console.log("id", id)
        break
      }
      case "sort": {
        const sortBy = element.dataset.sortBy
        const isValidSortKey = columns.find(
          (column) => column.key === sortBy
        )?.sortable
        if (!isValidSortKey) return
        const urlSortBy = currentSearchParams.get("sortBy")
        const urlOrder = currentSearchParams.get("order") || ""
        const isSameColumn = urlSortBy === sortBy
        const currentOrder = isSameColumn ? urlOrder : ""

        // compute the next sorting order based on the current state
        let nextOrder
        if (currentOrder === "") nextOrder = "asc"
        else if (currentOrder === "asc") nextOrder = "desc"
        else nextOrder = ""
        // reset old sorting in the dom
        dataTable.querySelectorAll("th[data-sort-by]").forEach((th) => {
          th.dataset.sort = ""
          th.classList.remove("is-sorted", "sort-asc", "sort-desc")
        })

        // apply new sorting
        if (nextOrder !== "") {
          element.dataset.sort = nextOrder
          element.classList.add("is-sorted")
          element.classList.add(nextOrder === "asc" ? "sort-asc" : "sort-desc")
        }

        // update search params
        if (nextOrder === "") {
          currentSearchParams.delete("sortBy")
          currentSearchParams.delete("order")
        } else {
          currentSearchParams.set("sortBy", sortBy)
          currentSearchParams.set("order", nextOrder)
        }

        replaceSearchParams(currentSearchParams)
        break
      }

      case "pageChange": {
        const { dataset = { page: 1 }, classList = [] } =
          e.target.closest("button") || {}
        const page = dataset.page
        const isDisabled = classList.contains("active")
        if (isDisabled) {
          return
        }

        currentSearchParams.set("page", page)
        replaceSearchParams(currentSearchParams)
        break
      }
      case "next": {
        const nextPage = element?.dataset.page
        const isDisabled = element.classList.contains("disabled")
        if (isDisabled) {
          return
        }
        currentSearchParams.set("page", nextPage)
        replaceSearchParams(currentSearchParams)
        break
      }
      case "prev": {
        const prevPage = element?.dataset.page
        const isDisabled = element.classList.contains("disabled")
        if (isDisabled) {
          return
        }
        currentSearchParams.set("page", prevPage)
        replaceSearchParams(currentSearchParams)
        break
      }
    }
  })

  dataTable.addEventListener("change", (e) => {
    const element = e.target.closest("[data-control]")
    if (!element) return
    const control = element.dataset.control

    if (control === "rows") {
      currentSearchParams.set("page", 1)
      currentSearchParams.set("limit", element.value)

      replaceSearchParams(currentSearchParams)
    }
  })

  // sync sorting on mount
  const setSorting = () => {
    const currentSort = currentSearchParams.get("sortBy")
    const currentOrder = currentSearchParams.get("order")
    if (!currentSort) return

    const el = dataTable.querySelector(`th[data-sort-by="${currentSort}"]`)

    if (!el) return

    el.classList.add("is-sorted")
    el.classList.add(currentOrder === "asc" ? "sort-asc" : "sort-desc")
  }
  // ------ Init -------
  mountFilters(filters)
  await fetchEquipmentList()
  setSorting()
}
