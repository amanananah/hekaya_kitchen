const app = document.querySelector("#app");

const icons = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z"/></svg>`,
  capture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m8 5 1.2-2h5.6L16 5"/><circle cx="12" cy="12" r="3.2"/></svg>`,
  family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M15 16a5 5 0 0 1 6 4.9"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m9 7 8 5-8 5V7Z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c.5 5.5 4.5 9.5 10 10-5.5.5-9.5 4.5-10 10-.5-5.5-4.5-9.5-10-10 5.5-.5 9.5-4.5 10-10Z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>`,
};

const family = [
  { initials: "F", name: "Fatima" },
  { initials: "M", name: "Mariam" },
  { initials: "S", name: "Saeed" },
  { initials: "+", name: "Invite" },
];

let activeTab = "home";
let activeView = "tab";
let captureStage = "intro";
let lessonStep = 3;

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

function subscreenHeader(title, subtitle = "Living family recipes") {
  return `<header class="subscreen-header">
    <button class="icon-button" data-action="back" aria-label="Go back">${icons.back}</button>
    <div><h1>${title}</h1><p>${subtitle}</p></div>
  </header>`;
}

function captureScreen() {
  if (captureStage === "recording") {
    return `<div class="app-frame"><main class="subscreen"><section class="camera-stage">
      <div class="camera-top"><span class="live-badge"><span class="live-dot"></span> Mirath is observing</span><span class="record-time">00:24</span></div>
      <div class="focus-frame" aria-hidden="true"></div>
      <div class="detection-stack"><span class="detected-chip">Flour recognised</span><span class="detected-chip">Mixing action</span><span class="detected-chip">Grandma speaking Arabic</span></div>
      <div class="camera-bottom"><p>Keep cooking naturally—no need to explain every detail.</p><button class="stop-recording" data-action="finish-capture" aria-label="Stop recording"></button></div>
    </section></main></div>`;
  }

  if (captureStage === "analysis") {
    return `<div class="app-frame"><main class="subscreen"><section class="analysis-screen"><div>
      <div class="analysis-orbit"><div class="analysis-mark arabic">ميراث</div></div>
      <h1>Finding the unwritten details</h1>
      <p>Mirath is separating the steps, listening for family stories and saving the moments where “it looks right.”</p>
      <div class="analysis-steps"><div class="analysis-step done"><span class="mini-check">✓</span> 5 cooking actions detected</div><div class="analysis-step done"><span class="mini-check">✓</span> Arabic voice transcribed</div><div class="analysis-step"><span class="mini-check">·</span> Building visual checkpoints…</div></div>
    </div></section></main></div>`;
  }

  if (captureStage === "result") {
    const steps = [
      ["Step 1", "Mix the dough", "Flour, yeast, saffron and warm water were combined by hand.", "Visual checkpoint"],
      ["Step 2", "Wait for the ribbon", "The dough should fall slowly from the fingers without breaking.", "Grandma's phrase"],
      ["Step 3", "Fry until deep gold", "Turn each piece once the lower edge becomes amber.", "Visual checkpoint"],
    ];
    return `<div class="app-frame"><main class="subscreen">
      ${subscreenHeader("Your living recipe", "Captured from Grandma Fatima")}
      <div class="result-banner"><span class="learn-icon">${icons.check}</span><div><h2>Mirath found 5 teachable moments</h2><p>Review the uncertain details with Grandma before saving.</p></div></div>
      <div class="confidence"><div class="confidence-head"><strong>Recipe confidence</strong><span>86%</span></div><div class="confidence-bar"><span></span></div></div>
      <div class="section-heading"><div><h2>What Mirath understood</h2><p>The demonstration has become a first draft</p></div></div>
      <div class="extracted-list">${steps.map(([index, title, copy, tag]) => `<article class="extracted-step"><div class="step-topline"><span class="step-index">${index}</span><span class="checkpoint-tag">${tag}</span></div><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
      <div class="button-row"><button class="secondary-button" data-action="retake">Retake</button><button class="primary-button" data-action="save-recipe">Save recipe</button></div>
    </main></div>`;
  }

  return `<div class="app-frame"><main class="subscreen">
    ${subscreenHeader("Capture a recipe", "Grandma can simply cook as usual")}
    <p class="eyebrow">A quiet AI apprentice</p><h1 class="subscreen-title">Keep the phone nearby. Let the memory unfold.</h1>
    <p class="subscreen-copy">Mirath watches for actions and textures while preserving the original voice. It asks questions only after the cooking is finished.</p>
    <div class="capture-intro-art"><div class="phone-outline"><div class="phone-lens"></div></div></div>
    <div class="tip-list"><div class="tip"><span class="tip-number">1</span><p>Keep the ingredients and hands visible when possible.</p></div><div class="tip"><span class="tip-number">2</span><p>Speak naturally in Arabic, English or your family dialect.</p></div><div class="tip"><span class="tip-number">3</span><p>Mirath will mark uncertain quantities for confirmation.</p></div></div>
    <button class="primary-button full-button" data-action="begin-capture"><span class="record-glyph"></span> Begin demonstration</button>
  </main></div>`;
}

function recipeScreen() {
  return `<div class="app-frame"><main class="subscreen">
    ${subscreenHeader("Luqaimat · لقيمات", "Grandma Fatima's living recipe")}
    <div class="recipe-visual" style="border-radius:28px"><span class="recipe-badge">Original demonstration · 6:42</span><div class="plate"><span></span><span></span><span></span></div></div>
    <div class="recipe-meta"><span class="chip">5 visual checkpoints</span><span class="chip">Arabic + English</span><span class="chip">86% confirmed</span></div>
    <div class="story-quote"><p>“My mother always made the first batch small. She said the oil also needs to learn.”</p><span>Grandma Fatima · family memory attached to Step 4</span></div>
    <section class="section"><div class="section-heading"><div><h2>What makes this version ours</h2><p>Knowledge a normal recipe would miss</p></div></div><div class="extracted-list"><article class="extracted-step"><span class="step-index">Texture</span><h3>The ribbon test</h3><p>The dough folds back into itself in roughly three seconds.</p></article><article class="extracted-step"><span class="step-index">Sound</span><h3>Listen for the softer sizzle</h3><p>Grandma lowers the heat when the oil changes from a sharp crackle.</p></article></div></section>
    <button class="primary-button full-button" data-action="start-learning">Cook with Grandma's guidance</button>
  </main></div>`;
}

function lessonScreen() {
  const isComplete = lessonStep >= 5;
  if (isComplete) {
    return `<div class="app-frame"><main class="subscreen"><section class="analysis-screen"><div><div class="analysis-mark arabic" style="margin:0 auto 22px">تم</div><h1>You carried it forward.</h1><p>Your first Luqaimat attempt is ready to send to Grandma Fatima for a voice review.</p><div class="button-row"><button class="secondary-button" data-action="back-home">Home</button><button class="primary-button" data-action="send-review">Ask Grandma</button></div></div></section></main></div>`;
  }
  return `<div class="app-frame"><main class="subscreen">
    ${subscreenHeader("Grandchild Mode", `Luqaimat · Step ${lessonStep} of 5`)}
    <div class="lesson-progress">${[1,2,3,4,5].map((step) => `<span class="${step <= lessonStep ? "complete" : ""}"></span>`).join("")}</div>
    <section class="checkpoint-demo"><div><p class="eyebrow" style="color:#d8b775">Grandma's visual checkpoint</p><h2>Let the dough fall in a slow ribbon.</h2></div><div class="texture-ribbon" aria-label="Illustration of dough ribbon texture"></div></section>
    <div class="coach-note"><span class="learn-icon">${icons.spark}</span><p><strong>Mirath sees a close match.</strong><br>Your mixture may be slightly thick. Add one teaspoon of warm water, then compare again.</p></div>
    <div class="button-row"><button class="secondary-button" data-action="hear-grandma">Hear Grandma</button><button class="primary-button" data-action="next-step">Looks right</button></div>
  </main></div>`;
}

function placeholderScreen(tab) {
  const copy = {
    book: ["Family recipe vault", "Every recipe will keep its original voice, visual checkpoints and the people who shaped it."],
    family: ["Your family circle", "Invite relatives to teach, learn, review attempts and add their version of each story."],
  }[tab];
  return `<div class="app-frame"><main class="screen">${topbar()}<section class="empty-screen"><div><div class="brand-mark arabic" style="margin:auto">م</div><h1>${copy[0]}</h1><p>${copy[1]}</p><button class="secondary-button" data-nav="home">Return home</button></div></section></main>${navigation()}</div>`;
}

function render() {
  if (activeView === "capture") app.innerHTML = captureScreen();
  else if (activeView === "recipe") app.innerHTML = recipeScreen();
  else if (activeView === "lesson") app.innerHTML = lessonScreen();
  else app.innerHTML = activeTab === "home" ? homeScreen() : placeholderScreen(activeTab);
}

app.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    activeTab = nav.dataset.nav;
    activeView = activeTab === "capture" ? "capture" : "tab";
    if (activeTab === "capture") captureStage = "intro";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const type = action.dataset.action;
    if (type === "capture") { activeView = "capture"; captureStage = "intro"; }
    if (type === "begin-capture") captureStage = "recording";
    if (type === "retake") captureStage = "intro";
    if (type === "finish-capture") {
      captureStage = "analysis";
      render();
      window.setTimeout(() => { captureStage = "result"; render(); }, 1800);
      return;
    }
    if (type === "save-recipe" || type === "recipe") activeView = "recipe";
    if (type === "learn" || type === "start-learning") { activeView = "lesson"; lessonStep = 3; }
    if (type === "next-step") lessonStep += 1;
    if (type === "back") { activeView = "tab"; activeTab = "home"; }
    if (type === "back-home" || type === "send-review") { activeView = "tab"; activeTab = "home"; }
    if (type === "hear-grandma") window.alert("Grandma Fatima: ‘It should fall slowly, like a ribbon—not break like drops.’");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
