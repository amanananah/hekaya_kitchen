const app = document.querySelector("#app");

const icons = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/></svg>`,
  capture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m8 5 1.2-2h5.6L16 5"/><circle cx="12" cy="12" r="3.2"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M15 16a5 5 0 0 1 6 4.9"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m9 7 8 5-8 5V7Z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c.5 5.5 4.5 9.5 10 10-5.5.5-9.5 4.5-10 10-.5-5.5-4.5-9.5-10-10 5.5-.5 9.5-4.5 10-10Z"/></svg>`,
};

const family = [
  { initials: "F", name: "Fatima" },
  { initials: "M", name: "Mariam" },
  { initials: "S", name: "Saeed" },
  { initials: "+", name: "Invite" },
];

let activeTab = "home";

function navigation() {
  const items = [["home", "Home"], ["book", "Recipes"], ["capture", "Capture"], ["family", "Family"]];
  return `<nav class="bottom-nav" aria-label="Primary navigation">
    ${items.map(([id, label]) => `<button class="nav-button ${activeTab === id ? "active" : ""}" data-nav="${id}" aria-label="${label}">${icons[id]}<span>${label}</span></button>`).join("")}
  </nav>`;
}

function topbar() {
  return `<header class="topbar">
    <div class="brand-lockup">
      <div class="brand-mark arabic">م</div>
      <div><h2 class="brand-name">Mirath <span class="arabic">ميراث</span></h2><p class="brand-subtitle">A living family cookbook</p></div>
    </div>
    <button class="avatar" aria-label="Open profile">AF</button>
  </header>`;
}

function homeScreen() {
  return `<div class="app-frame">
    <main class="screen">
      ${topbar()}
      <section class="welcome">
        <p class="eyebrow">Good afternoon, Amanah</p>
        <h1>What shall we pass down today?</h1>
        <p>Record the gestures, stories and little secrets that make a family recipe yours.</p>
      </section>
      <section class="capture-hero">
        <p class="eyebrow" style="color:#d8b775">New family memory</p>
        <h2>Let Grandma cook. Mirath will remember.</h2>
        <p>No scripts or measurements needed. Capture the recipe exactly as it happens.</p>
        <button class="primary-button light" data-action="capture"><span class="record-glyph"></span> Start capturing</button>
      </section>
      <section class="section">
        <div class="section-heading">
          <div><h2>From your family table</h2><p>Recipes carrying a voice and a story</p></div>
          <button class="text-button" data-nav="book">View all</button>
        </div>
        <article class="recipe-card">
          <div class="recipe-visual">
            <span class="recipe-badge">Fatima's recipe · 1987</span>
            <div class="plate" aria-label="Illustration of luqaimat"><span></span><span></span><span></span></div>
          </div>
          <div class="recipe-content">
            <div class="recipe-title-row">
              <div><h3>Luqaimat <span class="arabic">لقيمات</span></h3><p>Golden dumplings with date syrup, taught by Grandma Fatima.</p></div>
              <button class="play-button" data-action="recipe" aria-label="Open Luqaimat recipe">${icons.play}</button>
            </div>
            <div class="recipe-meta"><span class="chip">5 visual checkpoints</span><span class="chip">3 family stories</span></div>
          </div>
        </article>
      </section>
      <section class="section">
        <div class="section-heading"><div><h2>Continue learning</h2><p>Pick up where Grandma left you</p></div></div>
        <button class="learn-card" data-action="learn" style="border:0;width:100%;text-align:left">
          <span class="learn-icon">${icons.spark}</span>
          <span><h3>Mastering the dough</h3><p>Next: recognise the perfect ribbon texture</p></span>
          <span class="progress-ring" aria-label="3 of 5 steps complete"></span>
        </button>
      </section>
      <section class="section">
        <div class="section-heading"><div><h2>Your family circle</h2><p>Every person holds a piece of the story</p></div></div>
        <div class="family-row">${family.map((person) => `<div class="family-person"><div class="family-face">${person.initials}</div><span>${person.name}</span></div>`).join("")}</div>
      </section>
    </main>
    ${navigation()}
  </div>`;
}

function placeholderScreen(tab) {
  const copy = {
    book: ["Family recipe vault", "Every recipe will keep its original voice, visual checkpoints and the people who shaped it."],
    capture: ["Capture a recipe", "This is where Mirath will quietly observe a cooking demonstration and turn it into teachable family knowledge."],
    family: ["Your family circle", "Invite relatives to teach, learn, review attempts and add their version of each story."],
  }[tab];
  return `<div class="app-frame"><main class="screen">${topbar()}<section class="empty-screen"><div><div class="brand-mark arabic" style="margin:auto">م</div><h1>${copy[0]}</h1><p>${copy[1]}</p><button class="secondary-button" data-nav="home">Return home</button></div></section></main>${navigation()}</div>`;
}

function render() {
  app.innerHTML = activeTab === "home" ? homeScreen() : placeholderScreen(activeTab);
}

app.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    activeTab = nav.dataset.nav;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    activeTab = action.dataset.action === "capture" ? "capture" : "book";
    render();
  }
});

render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}

