import mockApi from "@/utils/mockApi"
import { DataTable, LoaderSpinner, StatusBadge } from "@/components/ui"
import DataTableFilters, {
  mountFilters,
} from "@/components/ReservationFiltersPanel"
import Modal from "@/components/ui/Modal"
import { router } from "@/router"
import { API } from "@/constants/api";
import { ROUTES } from "@/constants/routes"
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
      <!-- Page header -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 class="fw-bold mb-1">Equipment History</h3>
          <p class="text-muted mb-0">Overview of reserved equipment</p>
        </div>

        <a href="${ROUTES.MAKE_RESERVATION}" data-link class="btn btn-dark" aria-label="Create Reservation">
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

      <!-- Reservation item view -->
      ${Modal()}
    </div>
  `
}

export async function mounted() {
  // ---- Table Headers ----
  const columns = Object.freeze([
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
      header: "Return Date",
      key: "returnDate",
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
          data-bs-toggle="modal"
          data-bs-target="#reservationDetailsModal"
        >
           <i class="bi bi-eye"></i> View
        </button>
      `,
    },
  ])

  // ---- constants ----
  const dataTable = document.getElementById("dataTable")
  const filters = document.getElementById("filters")

  const reloadBtnEventController = new AbortController()
  const currentSearchParams = getCurrentSearchParams()

  let reservationsCache = []

  // ---- Functions ----
  const fetchEquipmentList = async () => {
    const currentQuery = urlToObject(currentSearchParams)

    try {
      const url = objectToUrl(
        new URLSearchParams(currentQuery),
        API.EQUIPMENT_HISTORY
      )
      const response = await mockApi(url)

      if (!response.ok) {
        const errorData = await response.json?.()
        toastify({ type: "error", message: errorData || "Submission Failed" })
        return
      }
      reservationsCache = await response.json()

      // console log is left intentionally
      console.log("Equipment List: ", reservationsCache)
      const { data, pagination } = reservationsCache || {}
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
        message:
          "Failed to fetch Equipment History. Please try again later. (This error is intentional)",
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

  const sortTableList = (sortBy, headerElement) => {
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
    if (headerElement && nextOrder !== "") {
      headerElement.dataset.sort = nextOrder
      headerElement.classList.add("is-sorted")
      headerElement.classList.add(
        nextOrder === "asc" ? "sort-asc" : "sort-desc"
      )
    }

    // update search params
    if (nextOrder === "") {
      currentSearchParams.delete("sortBy")
      currentSearchParams.delete("order")
    } else {
      currentSearchParams.set("sortBy", sortBy)
      currentSearchParams.set("order", nextOrder)
    }

    currentSearchParams.set("page", 1)
    replaceSearchParams(currentSearchParams)
  }

  // ---- DataTable - event listeners ----
  dataTable.addEventListener("click", async (e) => {
    const element = e.target.closest("[data-action]")
    if (!element) return
    const action = element.dataset.action

    switch (action) {
      case "view": {
        const id = element.dataset.id
        const modalBodyEl = document.querySelector(
          "#reservationDetailsModal .modal-body"
        )

        if (modalBodyEl) {
          const itemData = reservationsCache?.data?.find((el) => el.id === id)
          if (!itemData) return

          modalBodyEl.innerHTML = `<dl class="row mb-0">
              <dt class="col-5">Employee Id</dt><dd class="col-7">${itemData.employeeId}</dd>
              <dt class="col-5">Equipment</dt><dd class="col-7">${itemData.equipmentName}</dd>
              <dt class="col-5">Reservation Date</dt><dd class="col-7">${itemData.reservationDate}</dd>
              <dt class="col-5">Status</dt><dd class="col-7">${StatusBadge(itemData.status)}</dd>
              <dt class="col-5">Return Date</dt><dd class="col-7">${itemData.returnDate || "-"}</dd>
            </dl>`
        }

        break
      }
      case "sort": {
        const sortBy = element.dataset.sortBy
        const isValidSortKey = columns.find(
          (column) => column.key === sortBy
        )?.sortable
        if (!isValidSortKey) return

        sortTableList(sortBy, element)
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

    switch (control) {
      case "rows":
        {
          currentSearchParams.set("page", 1)
          currentSearchParams.set("limit", element.value)

          replaceSearchParams(currentSearchParams)
        }
        break
      case "mobile-sort": {
        const sortBy = element.value
        sortTableList(sortBy)
      }
      case "mobile-order":
        {
          const sortOrder = element.value

          currentSearchParams.set("order", sortOrder)
          replaceSearchParams(currentSearchParams)
        }
        break
    }
  })

  // sync sorting on mount
  const setSorting = () => {
    // sorting in the header - on desktop
    const currentSort = currentSearchParams.get("sortBy")
    const currentOrder = currentSearchParams.get("order")
    if (!currentSort) return

    const el = dataTable.querySelector(`th[data-sort-by="${currentSort}"]`)

    if (!el) return

    el.classList.add("is-sorted")
    el.classList.add(currentOrder === "asc" ? "sort-asc" : "sort-desc")

    // sorting & order using dropdowns - on mobile
    if (currentSort) {
      const sortDropdown = dataTable.querySelector(
        "[data-control='mobile-sort']"
      )
      sortDropdown.value = currentSort
      sortDropdown.value = currentSort
    }

    const orderDropdown = dataTable.querySelector(
      "[data-control='mobile-order']"
    )
    orderDropdown.value = currentOrder
  }
  // ------ Init -------
  router.setPageMeta({
    title: "Equipment Reservations",
    description: "Review and manage past and upcoming equipment reservations.",
  })
  mountFilters(filters)
  await fetchEquipmentList()
  setSorting()
}
