import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "bootstrap-icons/font/bootstrap-icons.css"
import "@/styles/main.css"
import "notyf/notyf.min.css"
import { router } from "@/router"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

document.querySelector("#app").innerHTML = `
  <div>
    ${Header()}
    <div class="container">
      <main id="view" class="py-3 position-relative"></main>
    </div>
    ${Footer()}
  </div>
`
router.init()
