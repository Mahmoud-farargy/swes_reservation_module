// export const css = '/src/styles/about.css';

export default function ReservationForm() {
  return `
  <div class="row justify-content-center my-3">
    <div class="col-lg-7 col-xl-6">
      
      <div class="card shadow-sm border-0">
        <div class="card-body p-3 p-md-4 p-lg-5">

          <!-- Title -->
          <div class="mb-4">
            <h3 class="fw-bold text-dark mb-1">Create Reservation</h3>
            <p class="text-muted mb-0">
              Reserve equipment for an employee
            </p>
          </div>

          <!-- Form -->
          <form id="reservationForm" novalidate >

            <!-- Employee ID -->
            <div class="mb-3">
              <label for="employeeId" class="form-label fw-semibold">
                Employee ID <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="employeeId"
                placeholder="EMP-1001"
                required
              />
              <div class="invalid-feedback">
                Employee ID is required.
              </div>
            </div>

            <!-- Equipment -->
            <div class="mb-3">
              <label for="equipment" class="form-label fw-semibold">
                Equipment Category <span class="text-danger">*</span>
              </label>
              <select class="form-select" id="equipment" required>
                <option value="">Select equipment</option>
                <option value="helmet">Helmet</option>
                <option value="boots">Boots</option>
                <option value="gloves">Gloves</option>
              </select>
              <div class="invalid-feedback">
                Please select equipment.
              </div>
            </div>

            <!-- Reservation Date -->
            <div class="mb-4">
              <label for="reservationDate" class="form-label fw-semibold">
                Reservation Date <span class="text-danger">*</span>
              </label>
              <input
                type="date"
                class="form-control"
                id="reservationDate"
                required
              />
              <div class="invalid-feedback">
                Reservation date is required.
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex align-items-center justify-content-between">
              <a href="/" data-link class="text-decoration-none text-muted d-none d-md-block">
                ← Back to list
              </a>

              <button type="submit" class="btn btn-dark px-4">
                Create Reservation
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  </div>

  `;
}

export function mounted() {
  const reservationDateElement = document.getElementById("reservationDate");
  const params = new URLSearchParams(window.location.search);
  const date = params.get('date');
  if(date){
    reservationDateElement.value = date;
  }
  console.log("extracted date", date);
  
}
