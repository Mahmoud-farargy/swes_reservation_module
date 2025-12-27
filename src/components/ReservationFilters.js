import {
  getCurrentSearchParams,
  objectToUrl,
  todayISO,
  clampDate,
  lowerString,
} from "@/utils/helpers"
import { router } from "@/router"

export default function DataTableFilters() {
  return `
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
                  data-filter="search"
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
                  <select class="form-select" data-filter="equipment">
                    <option value="">All Equipment Categories</option>
                    <option value="EQ-1">Boots</option>
                    <option value="EQ-2">Vest</option>
                    <option value="EQ-3">Helmet</option>
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
                  <input type="date" class="form-control" data-filter="dateFrom"/>
                </div>

                <div class="input-group">
                  <span class="input-group-text">
                     <i class="bi bi-arrow-right"></i>
                  </span>
                  <input type="date" class="form-control" data-filter="dateTo"/>
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
                    data-filter="status"
                    name="status"
                    value="Returned"
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
                    data-filter="status"
                    name="status"
                    value="Pending"
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
                    data-filter="status"
                    name="status"
                    value="Overdue"
                    checked
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
                <button class="btn btn-outline-secondary" data-action="reset-filters">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>
                  Reset filters
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `
}

export const mountFilters = (filtersRoot) => {
  if (!filtersRoot) return
  // ------- constants -------
  const dateFromEl = filtersRoot.querySelector('[data-filter="dateFrom"]')
  const dateToEl = filtersRoot.querySelector('[data-filter="dateTo"]')
  const TODAY = todayISO()

  // ------- functions -------
  function syncDateConstraints() {
    dateToEl.max = TODAY
    dateToEl.min = dateFromEl.value || ""
    dateFromEl.max = dateToEl.value || TODAY
  }

  function normalizeDateValues() {
    dateToEl.value = clampDate(dateToEl.value, {
      min: dateFromEl.value || null,
      max: TODAY,
    })

    dateFromEl.value = clampDate(dateFromEl.value, {
      min: null,
      max: dateToEl.value || TODAY,
    })

    syncDateConstraints()
  }

  function hydrateFiltersFromUrl() {
    const params = getCurrentSearchParams()
    const excludedRaw = params.get("excludedStatus") || ""
    const excludedSet = new Set(
      excludedRaw
        .split(",")
        .filter(Boolean)
        .map((value) => lowerString(value))
    )

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      const key = el.dataset.filter

      if (el.type === "checkbox" && key === "status") {
        el.checked = !excludedSet.has(lowerString(el.value))
        return
      }

      el.value = params.get(key) ?? ""
    })
  }

  function applyFiltersFromDom() {
    const params = new URLSearchParams()
    const excludedStatusList = []

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      const key = el.dataset.filter

      if (el.type === "checkbox" && key === "status") {
        if (!el.checked) excludedStatusList.push(el.value.toLowerCase())
        return
      }

      if (el.value) params.set(key, el.value)
    })

    if (excludedStatusList.length)
      params.set("excludedStatus", excludedStatusList.join(","))

    const newUrl = objectToUrl(params, location.pathname)
    router.replace(newUrl)
  }

  // ------- event listeners -------
  filtersRoot.addEventListener("change", (e) => {
    if (!e.target.matches("[data-filter]")) return

    if (e.target === dateFromEl || e.target === dateToEl) {
      normalizeDateValues()
    }

    applyFiltersFromDom()
  })

  filtersRoot.addEventListener("click", (e) => {
    if (e.target.dataset.action === "reset-filters") resetFilters()
  })

  function resetFilters() {
    router.replace(location.pathname)

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      if (el.type === "checkbox" && el.dataset.filter === "status")
        el.checked = true
      else el.value = ""
    })

    dateToEl.max = TODAY
    dateFromEl.max = TODAY
  }

  // ------- init -------
  hydrateFiltersFromUrl()
  normalizeDateValues()
}
