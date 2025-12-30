import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { router } from "@/router"
import { toastify, todayISO } from "@/utils/helpers"
import mockApi from "@/utils/mockApi"
import { ROUTES } from "@/constants/routes"
import { API } from "@/constants/api"
import { LoaderSpinner } from "@/components/ui"

export default function CalendarView() {
  return `
    <div class="my-3">
      <!-- Page header -->
      <div class="mb-4">
        <h3 class="fw-bold mb-1">Availability Calendar</h3>
        <p class="text-muted mb-0">
          Select an available date to create a reservation
        </p>
      </div>

      <!-- Indicators -->
      <div class="d-flex flex-wrap gap-3 mb-3">
        <div class="d-flex align-items-center gap-1">
          <span class="indicator-box" style="background-color: #6c757dc1;"></span>
          <small class="text-muted">Past</small>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="indicator-box" style="background-color: #198754c2;"></span>
          <small class="text-success">Available</small>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="indicator-box" style="background-color: #dc3546b7;"></span>
          <small class="text-danger">Reserved</small>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="indicator-box" style="background-color: #2f498655;"></span>
          <small class="text-gray">Today</small>
        </div>
      </div>

      <!-- Calendar Card -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-2 p-md-3 p-lg-4" class="position-relative">
          <div id="calendar">
            ${LoaderSpinner()}
          </div>
        </div>
      </div>
    </div>
  `
}

export async function mounted() {
  const calendarEl = document.getElementById("calendar")
  let blockedEvents = []

  try {
    const response = await mockApi(API.CALENDAR_BLOCKED_DATES)

    if (!response.ok) {
      const errorData = await response.json?.()
      toastify({ type: "error", message: errorData || "Submission Failed" })
      return
    }
    const result = await response.json()

    blockedEvents = result?.data?.map((item) => ({
      start: item.date,
      end: item.date,
      display: "background",
      backgroundColor: "#dc3545",
      extendedProps: {
        blocked: true,
        reason: item.reason,
      },
    }))
  } catch {
    toastify({
      type: "error",
      message:
        "Failed to fetch Equipment History. Please try again later. (This error is intentional)",
    })
  }

  function getAvailableEvents(view, blockedEvents) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const blockedSet = new Set(blockedEvents.map((e) => e.start))
    const available = []

    for (
      let day = new Date(view.start);
      day < view.end;
      day.setDate(day.getDate() + 1)
    ) {
      const dayISO = day.toISOString().slice(0, 10);
      const dayStart = new Date(day)
      dayStart.setHours(0, 0, 0, 0)

      if (dayStart < today) continue

      const dateStr = dayISO
      if (blockedSet.has(dateStr)) continue

      const isToday = dayISO === todayISO()
      if(isToday) continue

      available.push({
        start: dateStr,
        display: "background",
        backgroundColor: "#198754",
        extendedProps: { available: true },
      })
    }

    return available
  }

  const calendar = new Calendar(calendarEl, {
    height: "72vh",
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    validRange: {
      start: todayISO(),
    },
    events(info, successCallback) {
      const available = getAvailableEvents(info, blockedEvents)
      successCallback([...blockedEvents, ...available])
    },
    dateClick: function (info) {
      const isBlocked = blockedEvents.some(
        (item) => item.start === info.dateStr
      )

      if (isBlocked) return
      router.push(`${ROUTES.MAKE_RESERVATION}?date=${info.dateStr}`)
    },
  })

  // ---- Init ----
  calendar.render()
  router.setPageMeta({
    title: "Reservation Calendar",
    description: "Check availability and select valid dates for reservations.",
  })
}
