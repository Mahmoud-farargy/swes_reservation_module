import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./styles/main.css"
import { initRouter } from "./router.js"
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"

document.querySelector("#app").innerHTML = `
  <div>
    ${Header()}
    <div class="container">
      <main id="view" class="py-3"></main>
    </div>
    ${Footer()}
  </div>
`
initRouter()
