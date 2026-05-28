/* ══════════════════════════════════════
   main.js (FIXED + CLEAN REVEAL SYSTEM)
══════════════════════════════════════ */

const API_URL = "https://portifolio-kmnf.onrender.com";

/* ── FETCH HELPER ── */
async function get(path) {
  const res = await fetch(API_URL + path);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

/* ══════════════════════════
   PROFILE
══════════════════════════ */
async function loadProfile() {
  try {
    const p = await get("/profile");

    document.getElementById("hero-name").textContent = p.name;
    document.getElementById("hero-title").textContent = p.role;
    document.getElementById("hero-bio").textContent = p.bio;
    document.getElementById("footer-name").textContent = p.name;

    const initials = p.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    document.getElementById("avatar-initials").textContent = initials;

    document.title = `${p.name} | ${p.role}`;

  } catch (err) {
    console.error("Profile load failed:", err);
  }
}

/* ══════════════════════════
   SKILLS
══════════════════════════ */
async function loadSkills() {
  const grid = document.getElementById("skills-grid");

  if (!grid) {
    console.error("skills-grid not found");
    return;
  }

  try {
    const skills = await get("/skills");

    grid.innerHTML = "";

    skills.forEach(domain => {
      const label = document.createElement("div");

      label.innerHTML = `
        <p style="
          font-family:'Syne',sans-serif;
          font-size:0.78rem;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:0.12em;
          color:var(--accent);
          border-bottom:1px solid var(--border);
          padding-bottom:0.4rem;
          margin-top:1.2rem;
          margin-bottom:0.5rem;">
          ${domain.domain}
        </p>
      `;

      grid.appendChild(label);

      domain.technologies.forEach(tech => {
        const pill = document.createElement("span");
        pill.className = "skill-pill reveal";
        pill.textContent = tech;
        grid.appendChild(pill);
      });
    });

    requestAnimationFrame(() => {
      activateReveal();
    });

  } catch (err) {
    console.error("Skills load failed:", err);
  }
}

/* ══════════════════════════
   QUALIFICATIONS
══════════════════════════ */
async function loadQualifications() {
  const list = document.getElementById("qualifications-list");

  try {
    const data = await get("/qualifications");

    list.innerHTML = "";

    data.education.forEach(e => {
      const item = document.createElement("div");
      item.className = "timeline-item reveal";

      item.innerHTML = `
        <p class="timeline-year">${e.period}</p>
        <p class="timeline-degree">${e.degree}</p>
        <p class="timeline-school">🏛 ${e.institution}</p>
        <p style="color:var(--muted);font-size:0.88rem;margin-top:0.5rem;">
          ${e.description}
        </p>
      `;

      list.appendChild(item);
    });

    requestAnimationFrame(() => {
      activateReveal();
    });

  } catch (err) {
    console.error("Qualifications load failed:", err);
  }
}

/* ══════════════════════════
   PROJECTS
══════════════════════════ */
async function loadProjects() {
  const grid = document.getElementById("projects-grid");

  try {
    const projects = await get("/projects");

    grid.innerHTML = "";

    projects.forEach(p => {
      const card = document.createElement("div");
      card.className = "project-card reveal";

      card.innerHTML = `
        <div style="font-size:2rem;margin-bottom:0.5rem;">
          ${p.emoji}
        </div>

        <p class="project-name">${p.title}</p>
        <p class="project-desc">${p.description}</p>

        <div class="project-tech">
          ${p.stack.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>

        <div style="display:flex;gap:1rem;margin-top:1rem;">
          <a href="${p.liveUrl}" class="project-link" target="_blank">↗ Live</a>
          <a href="${p.githubUrl}" class="project-link" target="_blank">GitHub</a>
        </div>
      `;

      grid.appendChild(card);
    });

    requestAnimationFrame(() => {
      activateReveal();
    });

  } catch (err) {
    console.error("Projects load failed:", err);
  }
}

/* ══════════════════════════
   CONTACT
══════════════════════════ */
async function loadContact() {
  const cards = document.getElementById("contact-cards");

  try {
    const p = await get("/profile");

    cards.innerHTML = "";

    const items = [
      { icon: "📧", label: "Email", value: p.email, href: `mailto:${p.email}` },
      { icon: "📞", label: "Phone", value: p.phone, href: `tel:${p.phone}` },
      { icon: "📍", label: "Location", value: p.location, href: "#" },
      { icon: "🐙", label: "GitHub", value: "GitHub", href: p.social.github }
    ];

    items.forEach(item => {
      const card = document.createElement("a");
      card.className = "contact-card reveal";
      card.href = item.href;
      card.target = item.href.startsWith("http") ? "_blank" : "_self";

      card.innerHTML = `
        <div class="contact-icon">${item.icon}</div>
        <div>
          <p class="contact-label">${item.label}</p>
          <p class="contact-value">${item.value}</p>
        </div>
      `;

      cards.appendChild(card);
    });

    requestAnimationFrame(() => {
      activateReveal();
    });

  } catch (err) {
    console.error("Contact load failed:", err);
  }
}

/* ══════════════════════════
   REVEAL (FIXED SINGLE SYSTEM)
══════════════════════════ */
function activateReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.classList.add("visible");
        }, i * 80);

        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
    obs.observe(el);
  });
}

/* ══════════════════════════
   INIT
══════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadSkills();
  loadQualifications();
  loadProjects();
  loadContact();
});