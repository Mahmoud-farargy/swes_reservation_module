export default function LoaderSpinner() {
    return `
      <div class="d-flex justify-content-center align-items-center position-absolute h-100 w-100">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      `
}
