import mockApi from "@/utils/mockAPI"
import { toastify } from "@/utils/helpers.js"
import { router } from "@/router"
import { LoaderSpinner } from "./ui"

export default function ReservationForm() {
  return `
  <div class="position-relative">
   <!-- Loader -->
    <div id="loader" class="d-none">
        ${LoaderSpinner()}
    </div>
    <!-- Form -->
    <form id="reservationForm" novalidate>
        <!-- Employee ID -->
        <div class="mb-3">
          <label for="employeeId" class="form-label fw-semibold">
              Employee ID <span class="text-danger">*</span>
          </label>
          <input type="text" class="form-control" id="employeeId" pattern="EMP-[0-9]{4}" maxlength="8" placeholder="EMP-1001" required />
          <div class="invalid-feedback">
              Employee ID must be in the format <strong>EMP-1234</strong>.
          </div>
        </div>

        <!-- Equipment -->
        <div class="mb-3">
          <label for="equipment" class="form-label fw-semibold">
              Equipment Category <span class="text-danger">*</span>
          </label>
          <select class="form-select" id="equipment" required>
              <option value="">Select equipment</option>
              <option value="EQ-1" data-name="Boots">Boots</option>
              <option value="EQ-2" data-name="Vest">Vest</option>
              <option value="EQ-3" data-name="Helmet">Helmet</option>
          </select>
          <div class="invalid-feedback">
              Please select equipment.
          </div>
        </div>

        <!-- Reservation date -->
        <div class="mb-4">
          <label for="reservationDate" class="form-label fw-semibold">
              Reservation Date <span class="text-danger">*</span>
          </label>
          <input type="date" class="form-control" id="reservationDate" required />
          <div class="invalid-feedback">
              Reservation date is required.
          </div>
        </div>

        <!-- Actions box -->
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
`
}

export function mountedReservationForm(root) {
  if (!root) return
  // ---- Constants ----
  const reservationDateElement = root.querySelector("#reservationDate")
  const loaderElement = root.querySelector("#loader")
  const form = root.querySelector("#reservationForm")
  const submitButton = form.querySelector("button[type='submit']")

  // ---- First input focusing for better UX ----
  form.querySelector("#employeeId")?.focus()

  // ---- Pre-fill date from query ----
  const params = new URLSearchParams(window.location.search)
  const date = params.get("date")
  if (reservationDateElement && date) {
    reservationDateElement.value = date
  }

  // ---- Functions ----
  const toggleSpinner = (state) => {
    loaderElement.classList.toggle("d-none", !state)
    loaderElement.classList.toggle("d-block", state)
  }

  const setSubmitButtonState = (state) => {
    submitButton.classList.toggle("disabled", state)
  }

  const submitReservation = async (formData) => {
    submitButton.classList.add("disabled")
    setSubmitButtonState(true)
    toggleSpinner(true)

    try {
      const response = await mockApi("/api/reservations", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json?.();
        toastify({ type: "error", message: errorData|| "Submission Failed" })
        return
      }

      const data = await response.json()

      await mockApi("/api/notify", {
        method: "POST",
        body: JSON.stringify({ resId: data.id }),
      })

      toastify({
        type: "success",
        message: "Reservation created and notification sent!",
      })

      form.reset()
      form.classList.remove("was-validated")

      router.push("/")
    } catch (err) {
      console.error(err)
      toastify({
        type: "error",
        message: "Unexpected error occurred",
      })
    } finally {
      setSubmitButtonState(false)
      toggleSpinner(false)
    }
  }

  // ---- Event listeners ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!form.checkValidity()) {
      form.classList.add("was-validated")
      return
    }
    
    const { employeeId, equipment, reservationDate } = form || {}

    const selectedOption = equipment.options[equipment.selectedIndex]
    const equipmentName = selectedOption.dataset.name;

    const formData = {
      employeeId: employeeId.value.trim(),
      equipmentId: equipment.value,
      equipmentName,
      reservationDate: reservationDate.value,
    }
    await submitReservation(formData)
  })
}
