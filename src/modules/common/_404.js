import { ROUTES } from "@/constants/routes";

export default function _404() {
    return `
        <div class="text-center mt-5">
          <h1> 404 - Page Not Found </h1>
          <a href="${ROUTES.HOME}" class="btn btn-dark btn-lg shadow-sm mt-3">
            <i class="bi bi-house-door-fill me-2"></i> Go Home
          </a>
        </div>
    `;
}