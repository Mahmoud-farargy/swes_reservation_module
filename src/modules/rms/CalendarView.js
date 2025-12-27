import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { router } from "@/router"
import { db } from "@/data/mockDB" // replace this with an mock api request

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
        <div class="card-body p-3 p-md-4">
          <div id="calendar"></div>
        </div>
      </div>

    </div>
  `
}

export async function mounted() {
  const calendarEl = document.getElementById("calendar")

  // { title: 'Available', start: '2025-12-24', color: '#28a745', extendedProps: { type: 'Available' } }
  // { title: 'Blocked', start: '2025-12-25', color: '#dc3545', extendedProps: { type: 'Blocked' } }

  const blockedEvents = db.calendarBlockedDates.map((item) => ({
    start: item.date,
    end: item.date,
    // title: item.reason,
    display: "background",
    // color: "#dd4857ff",
    backgroundColor: "#f8d7da",
    extendedProps: {
      blocked: true,
      reason: item.reason,
    },
  }))
  const calendar = new Calendar(calendarEl, {
    height: "72vh",
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    // dayCellClassNames(arg) {
    //   console.log("arg", arg);
    //   const isBlocked = db.calendarBlockedDates.some(
    //     d => d.date === arg.dateStr
    //   );

    //   return isBlocked ? ['day-blocked'] : ['day-available'];
    // },
    events: blockedEvents,
    dateClick: function (info) {
      const isBlocked =
        info.dayEl.classList.contains("fc-day-disabled") ||
        info.event?.extendedProps?.type === "Blocked"

      if (isBlocked) return
      router.push(`/make_reservation?date=${info.dateStr}`)
    },
  })

  calendar.render()
}
