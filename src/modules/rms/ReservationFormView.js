
import ReservationForm, { mountedReservationForm } from "@/components/ReservationForm";
import { router } from "@/router";

export default function ReservationFormView() {

  return `
    <div class="row justify-content-center my-3">
      <div class="col-lg-7 col-xl-6">
        
        <div class="card shadow-sm border-0">
          <div class="card-body p-3 p-md-4 p-lg-5">

            <!-- Page title -->
            <div class="mb-4">
              <h3 class="fw-bold text-dark mb-1">Create Reservation</h3>
              <p class="text-muted mb-0">
                Reserve equipment for an employee
              </p>
            </div>

            <!-- Form -->
            <div id="reservationFormRoot">
              ${ReservationForm()}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  `;
}

export function mounted() {
  const root = document.getElementById("reservationFormRoot");

  // ---- Init ----
  mountedReservationForm(root)
  
  router.setPageMeta({
    title: "Create Reservation",
    description: "Create a new reservation for employee equipment."
  })
}
