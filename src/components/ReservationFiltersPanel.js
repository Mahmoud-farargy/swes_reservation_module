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
              <label class="form-label fw-semibold" for="searchField">Search</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  id="searchField"
                  type="text"
                  class="form-control"
                  data-filter="search"
                  placeholder="Search by employee or item"
                />
              </div>
            </div>
            <!-- Equipment -->
            <div class="col-md-6 col-xl-4">
                <label class="form-label fw-semibold" for="equipmentField">Equipment</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-tags"></i>
                  </span>
                  <select id="equipmentField" class="form-select" data-filter="equipment">
                    <option value="">All Equipment Categories</option>
                    <option value="EQ-1">Boots</option>
                    <option value="EQ-2">Vest</option>
                    <option value="EQ-3">Helmet</option>
                  </select>
                </div>
            </div>
            <!-- Date range -->
            <div class="col-md-6 col-xl-4">
              <fieldset class="border-0 p-0 m-0">
                <legend class="form-label fw-semibold mb-1">
                  Reservation Date
                </legend>

                <div class="d-flex flex-wrap flex-sm-nowrap gap-2">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-calendar-event"></i>
                    </span>
                    <input
                      id="dateFromField"
                      type="date"
                      class="form-control"
                      data-filter="dateFrom"
                      aria-label="Reservation start date"
                    />
                  </div>

                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-arrow-right"></i>
                    </span>
                    <input
                      id="dateToField"
                      type="date"
                      class="form-control"
                      data-filter="dateTo"
                      aria-label="Reservation end date"
                    />
                  </div>
                </div>
              </fieldset>
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
  const resetButtonEl = filtersRoot.querySelector(
    '[data-action="reset-filters"]'
  )
  const dateFromEl = filtersRoot.querySelector('[data-filter="dateFrom"]')
  const dateToEl = filtersRoot.querySelector('[data-filter="dateTo"]')
  const today = todayISO()
  const currentSearchParams = getCurrentSearchParams()

  // ------- functions -------
  function syncDateConstraints() {
    dateToEl.max = today
    dateToEl.min = dateFromEl.value || ""
    dateFromEl.max = dateToEl.value || today
  }

  function normalizeDateValues() {
    dateToEl.value = clampDate(dateToEl.value, {
      min: dateFromEl.value || null,
      max: today,
    })

    dateFromEl.value = clampDate(dateFromEl.value, {
      min: null,
      max: dateToEl.value || today,
    })

    syncDateConstraints()
  }

  function hydrateFiltersFromUrl() {
    const excludedRaw = currentSearchParams.get("excludedStatus") || ""
    const excludedSet = new Set(
      excludedRaw
        .split(",")
        .filter(Boolean)
        .map((value) => lowerString(value))
    )

    let isFilterInUse = !!excludedSet.size;

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      const key = el.dataset.filter
      const currentValue = currentSearchParams.get(key);

      if (el.type === "checkbox" && key === "status") {
        el.checked = !excludedSet.has(lowerString(el.value))
        return
      }

      if(currentValue) isFilterInUse = true;
      
      el.value = currentValue ?? ""
    })

    toggleResetButtonVisibility(isFilterInUse)
  }

  function applyFiltersFromDom() {
    const currentSearchParams = getCurrentSearchParams()
    const excludedStatusList = []

    // clear old params first as a reset
    deleteFilters()

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      const key = el.dataset.filter

      if (el.type === "checkbox" && key === "status") {
        if (!el.checked) excludedStatusList.push(lowerString(el.value))
        return
      }

      if (el.value) currentSearchParams.set(key, el.value)
    })

    if (excludedStatusList.length)
      currentSearchParams.set("excludedStatus", excludedStatusList.join(","))

    currentSearchParams.set("page", 1)

    const newUrl = objectToUrl(currentSearchParams, location.pathname)

    // debugger 
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

  function deleteFilters() {
    currentSearchParams.delete("search")
    currentSearchParams.delete("equipment")
    currentSearchParams.delete("dateFrom")
    currentSearchParams.delete("dateTo")
    currentSearchParams.delete("excludedStatus")
  }
  
  function resetFilters() {
    deleteFilters();
    const newUrl = objectToUrl(currentSearchParams, location.pathname)

    router.replace(newUrl)

    filtersRoot.querySelectorAll("[data-filter]").forEach((el) => {
      if (el.type === "checkbox" && el.dataset.filter === "status")
        el.checked = true
      else el.value = ""
    })

    dateToEl.max = today
    dateFromEl.max = today
  }

  function toggleResetButtonVisibility(showButton) {
    resetButtonEl.classList.toggle("d-none", !showButton)
    resetButtonEl.classList.toggle("d-block", showButton)
  }

  // ------- init -------
  hydrateFiltersFromUrl()
  normalizeDateValues()
}
