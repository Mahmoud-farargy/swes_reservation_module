import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { router } from "@/router"
import { toastify } from "@/utils/helpers"
import mockApi from "@/utils/mockApi"
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
    const response = await mockApi("/api/calendar-blocked-dates")

    if (!response.ok) {
      const errorData = await response.json?.()
      toastify({ type: "error", message: errorData || "Submission Failed" })
      return
    }
    const result = await response.json()

    blockedEvents = result?.data?.map((item) => ({
      start: item.date,
      end: item.date,
      title: item.reason,
      color: "#dc3545",
      extendedProps: {
        blocked: true,
        reason: item.reason,
      },
    }))
  } catch {
    toastify({
      type: "error",
      message: "Failed to fetch Equipment History. Please try again later.",
    })
  }

  const calendar = new Calendar(calendarEl, {
    height: "72vh",
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    // dayCellClassNames(info) {
    //   const isBlocked = blockedEvents.some((item) => {
    //     const date = info.date.toISOString().slice(0, 10)
    //     return item.end === date
    //   })

    //   return isBlocked ? ["day-blocked"] : ["day-available"]
    // },
    events: blockedEvents,
    dateClick: function (info) {
      const isBlocked = blockedEvents.some(
        (item) => item.start === info.dateStr
      )

      if (isBlocked) return
      router.push(`/make_reservation?date=${info.dateStr}`)
    },
  })

  calendar.render()
}
