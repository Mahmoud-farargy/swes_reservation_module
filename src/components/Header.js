export default function Header() {
  return `
    <header>
      <nav class="navbar navbar-expand-lg bg-white">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" data-link href="/" aria-label="Go to homepage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
              <rect x="0" y="0" width="200" height="60" rx="10" ry="10" fill="none" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#383838;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#000000;stop-opacity:0.2" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#383838" flood-opacity="0.3"/>
                </filter>
              </defs>
              <text x="0" y="45" font-family="Montserrat, Arial, sans-serif" font-size="50" font-weight="700" fill="#383838" filter="url(#shadow)">
                S
              </text>
              <text x="45" y="45" font-family="Montserrat, Arial, sans-serif" font-size="50" font-weight="700" fill="url(#grad1)">
                WES
              </text>
              <line x1="0" y1="55" x2="200" y2="55" stroke="#383838" stroke-width="2" stroke-linecap="round" opacity="0.2"/>
            </svg>
          </a>

          <!-- Mobile toggle -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarLinks" aria-controls="navbarLinks" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <!-- Links -->
          <div class="collapse navbar-collapse justify-content-end" id="navbarLinks">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link"
                    href="/"
                    data-link
                    aria-label="Go to homepage"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarLinks">
                    Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" 
                    href="/make_reservation"
                    data-link 
                    aria-label="Go to Create Reservation page"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarLinks">
                    Reservation
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                    href="/calendar"
                    data-link
                    aria-label="Go to Calendar page"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarLinks">
                    Calendar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
`
}
