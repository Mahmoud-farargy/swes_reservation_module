
const routes = {
  404: () => import('./modules/common/_404.js'),
  '/': () => import('./modules/rms/EquipmentListView.js'),
  '/make_reservation': () => import('./modules/rms/ReservationFormView.js'),
  '/calendar': () => import('./modules/rms/CalendarView.js'),
};

let currentCSS = null;

async function loadRoute(path) {
  const viewElement = document.getElementById('view');
  const routePath = path.split('?')[0];
  const loader = routes[routePath] || routes[404];

  const module = await loader();

  if (currentCSS) {
    currentCSS.remove();
    currentCSS = null;
  }

  if (module.css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = module.css;
    document.head.appendChild(link);
    currentCSS = link;
  }
  
  viewElement.innerHTML = await module.default();
  module.mounted?.();
  
  disableLinksDefaultBehavior();
}

export function navigate(path) {
  if (path === location.pathname + location.search) {
    return;
  }
  history.pushState({}, '', path);
  loadRoute(path);
}

window.addEventListener('popstate', () => {
  loadRoute(location.pathname);
});

export function disableLinksDefaultBehavior() {
    const allLinks = document.querySelectorAll("a[data-link]");
    allLinks.forEach((linkItem) => {
        linkItem.addEventListener("click", (clickEvent) => {
            clickEvent.preventDefault();
            const path = linkItem.pathname;
            navigate(path);
        })
    })
}

export function initRouter() { 
    loadRoute(location.pathname);
}