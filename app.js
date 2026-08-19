const app = document.querySelector("#app");

app.innerHTML = `
  <main class="loading-shell">
    <div class="loading-mark" aria-label="Mirath">ميراث</div>
  </main>
`;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}

