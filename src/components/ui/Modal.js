export default function Modal() {
  return `
    <div class="modal fade" id="reservationDetailsModal" tabindex="-1" aria-labelledby="reservationDetailsLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="reservationDetailsLabel">Reservation details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <dl class="row mb-0">
                    <dt class="col-5">Employee Id</dt><dd class="col-7" id="modalEmployeeId"></dd>
                    <dt class="col-5">Equipment</dt><dd class="col-7" id="modalEquipment"></dd>
                    <dt class="col-5">Reservation Date</dt><dd class="col-7" id="modalDate"></dd>
                    <dt class="col-5">Status</dt><dd class="col-7" id="modalStatus"></dd>
                    <dt class="col-5">Return Date</dt><dd class="col-7" id="modalReturn"></dd>
                    </dl>
                </div>
                <div class="modal-footer">
                    <small class="text-muted me-auto">Read-only view</small>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
}
