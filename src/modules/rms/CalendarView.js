import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { navigate } from '@/router';

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
const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    height: '72vh',
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: [
      { title: 'Available', start: '2025-12-24', color: '#28a745', extendedProps: { type: 'Available' } },
      { title: 'Blocked', start: '2025-12-25', color: '#dc3545', extendedProps: { type: 'Blocked' } }
    ],

    dateClick: function(info) {
        console.log('info', info);
    //     if(info.title === "Blocked"){
    //         return;
    //     }
      navigate(`/make_reservation?date=${info.dateStr}`)
    }
  });

  calendar.render();
}
