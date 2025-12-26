import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/main.css"
import "notyf/notyf.min.css"
import { router } from "@/router.js"
import Header from "@/components/Header.js"
import Footer from "@/components/Footer.js"

document.querySelector("#app").innerHTML = `
  <div>
    ${Header()}
    <div class="container">
      <main id="view" class="py-3"></main>
    </div>
    ${Footer()}
  </div>
`
router.init()
