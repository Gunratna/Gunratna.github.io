/* ============================================================
   Section components → window.Sections
   ============================================================ */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

/* ---------------- Icons (simple UI/brand glyphs) ---------------- */
const Icon = {
  sun: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  menu: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  close: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  chevron: (p) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  arrowR: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  arrowUR: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  ),
  code: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  ),
  mail: (p) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
    </svg>
  ),
  linkedin: (p) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z" />
    </svg>
  ),
  github: (p) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  ),
};
const ContactIcon = { email: Icon.mail, linkedin: Icon.linkedin, github: Icon.github };

/* ---------------- Navbar ---------------- */
function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useStateS(false);
  const [menuOpen, setMenuOpen] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["About", "#about"], ["Experience", "#experience"], ["Projects", "#projects"],
    ["Skills", "#skills"], ["Contact", "#contact"],
  ];
  return (
    <React.Fragment>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-name">Gunratna Borkar<span className="dot">.</span></a>
          <div className="nav-right">
            <div className="nav-links">
              {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
            </div>
            <button className="theme-btn" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
            </button>
            <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
              {menuOpen ? <Icon.close /> : <Icon.menu />}
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(([t, h]) => <a key={h} href={h} onClick={() => setMenuOpen(false)}>{t}</a>)}
        </div>
      )}
    </React.Fragment>
  );
}

/* ---------------- Hero ---------------- */
function HeroCode() {
  const D = window.PORTFOLIO;
  const rules = window.SYNTAX_RULES.json;
  const lines = D.heroJSON.split("\n");
  return (
    <div className="hero-code reveal">
      <div className="hero-code-bar">
        <span className="hcb-light r" /><span className="hcb-light y" /><span className="hcb-light g" />
        <span className="hero-code-name">{D.heroFile}</span>
      </div>
      <div className="hero-code-body">
        <div className="hcb-gutter">{lines.map((_, i) => <div key={i}>{i + 1}</div>)}</div>
        <div className="hcb-lines">
          {lines.map((ln, i) => (
            <div key={i}>
              {ln.length === 0 ? "\u200b" : window.tokenizeLine(ln, rules).map((t, k) => (
                <span key={k} className={t.cls || "tk-punc"}>{t.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const D = window.PORTFOLIO.hero;
  const meta = D.meta.split(" · ");
  return (
    <header className="hero wrap" id="top">
      <div className="hero-grid">
        <div>
          <h1 className="hero-name reveal">{D.name}</h1>
          <div className="hero-meta smallcaps reveal">
            {meta.map((m, i) => (
              <React.Fragment key={i}>{i > 0 && <span className="sep">·</span>}{m}</React.Fragment>
            ))}
          </div>
          <p className="hero-tagline reveal">{D.tagline}</p>
          <div className="hero-ctas reveal">
            <a className="btn btn-outline" href="Gunratna_Resume_08_06.pdf" target="_blank" rel="noreferrer">View Resume <Icon.arrowR /></a>
            <a className="btn btn-fill" href="#contact">Get in Touch</a>
          </div>
        </div>
        <HeroCode />
      </div>
    </header>
  );
}

/* ---------------- About ---------------- */
function About() {
  const D = window.PORTFOLIO.about;
  return (
    <section id="about" className="wrap">
      <div className="section-label reveal">About</div>
      <div className="about-grid">
        <div className="about-bio reveal">
          {D.bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="about-stats reveal">
          {D.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-num">{s.num}<span className="unit">{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Experience ---------------- */
function ExperienceItem({ exp }) {
  const [open, setOpen] = useStateS(false);
  return (
    <div className="exp reveal">
      <span className="exp-dot" />
      <div className="exp-year">{exp.year}</div>
      <div className="exp-head">
        <span className="exp-role">{exp.role}</span>
        <span className="exp-org">{exp.org}</span>
        {exp.orgNote && <span className="exp-orgnote">{exp.orgNote}</span>}
      </div>
      <div className="exp-period">{exp.period}</div>
      <p className="exp-blurb">{exp.blurb}</p>
      {exp.highlights && exp.highlights.length > 0 && (
        <ul className="exp-highlights">
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      {exp.expandable && (
        <React.Fragment>
          <button className={`exp-toggle ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)}>
            <span className="chev"><Icon.chevron /></span>
            {open ? "Hide projects" : `Show ${exp.chips.length} projects`}
          </button>
          <div className={`exp-chips ${open ? "open" : ""}`}>
            {exp.chips.map((c, i) => (
              <div className="chip" key={i}>
                <span className="chip-label">{c.label}</span>
                <span className="chip-note">{c.note}</span>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
function Experience() {
  const D = window.PORTFOLIO.experience;
  return (
    <section id="experience" className="wrap">
      <div className="section-label reveal">Experience</div>
      <div className="timeline">
        {D.map((e, i) => <ExperienceItem key={i} exp={e} />)}
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
function ProjectCard({ project, onOpenIDE }) {
  return (
    <article className="proj-card reveal">
      {project.experimental && <span className="proj-exp-tag">Experimental</span>}
      <h3 className="proj-name">{project.name}</h3>
      <p className="proj-tagline">{project.tagline}</p>
      <div className="proj-pills">
        {project.outcomes.map((o, i) => <span className="pill" key={i}>{o}</span>)}
      </div>
      <div className="proj-tech">
        {project.tech.map((t, i) => <span className="tech-tag" key={i}>{t}</span>)}
      </div>
      <div className="proj-actions">
        <button className="btn btn-fill" onClick={() => onOpenIDE(project)} style={{ fontSize: 13, padding: "9px 14px" }}>
          <Icon.code /> Architecture &amp; Code
        </button>
        <button className="btn btn-ghost" onClick={() => onOpenIDE(project)}>Details</button>
      </div>
    </article>
  );
}
function Projects({ onOpenIDE }) {
  return (
    <section id="projects" className="wrap">
      <div className="section-label reveal">Selected Projects</div>
      <div className="proj-grid">
        {window.PROJECTS.map((p) => <ProjectCard key={p.id} project={p} onOpenIDE={onOpenIDE} />)}
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
function Skills() {
  const D = window.PORTFOLIO.skills;
  return (
    <section id="skills" className="wrap">
      <div className="section-label reveal">Skills &amp; Tools</div>
      <div className="skills-rows reveal">
        {D.map((row, i) => (
          <div className="skill-row" key={i}>
            <div className="skill-group">{row.group}</div>
            <div className="skill-chips">
              {row.items.map((it, k) => <span className="skill-chip" key={k}>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Education ---------------- */
function Education() {
  const D = window.PORTFOLIO.education;
  const [open, setOpen] = useStateS(false);
  return (
    <section id="education" className="wrap">
      <div className="section-label reveal">Education</div>
      <div className="edu reveal">
        <div className="edu-org">{D.org}</div>
        <div className="edu-degree">{D.degree}</div>
        <div className="edu-dept">{D.dept}</div>
        <div className="edu-meta"><span>{D.period}</span></div>
        <div className="edu-cpi">{D.cpi}</div>
        <button className={`edu-toggle ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)}>
          <span className="chev"><Icon.chevron /></span>
          {open ? "Hide coursework" : "Show relevant coursework"}
        </button>
        <div className={`edu-courses ${open ? "open" : ""}`}>
          {D.coursework.map((c, i) => <span className="course" key={i}>{c}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Extracurriculars ---------------- */
function Extracurriculars() {
  const D = window.PORTFOLIO.extracurriculars;
  return (
    <section id="extracurriculars" className="wrap">
      <div className="section-label reveal">Leadership &amp; Activities</div>
      <div className="extra-grid reveal">
        {D.map((item, i) => (
          <div className="extra-item" key={i}>
            <div className="extra-head">
              <span className="extra-role">{item.role}</span>
              <span className="extra-org">{item.org}</span>
            </div>
            <p className="extra-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const D = window.PORTFOLIO.contact;
  return (
    <section id="contact" className="wrap">
      <div className="section-label reveal">Contact</div>
      <div className="contact-grid">
        <div className="contact-msg reveal">
          <span className="lead">Let's connect.</span>
          {D.message}
        </div>
        <div className="contact-links reveal">
          {D.links.map((l, i) => {
            const IC = ContactIcon[l.kind];
            return (
              <a className="contact-link" key={i} href={l.href} target="_blank" rel="noreferrer">
                <span className="contact-icon"><IC /></span>
                <span className="contact-link-text">
                  <span className="contact-link-kind">{l.kind}</span>
                  <span className="contact-link-label">{l.label}</span>
                </span>
                <span className="contact-arrow"><Icon.arrowUR /></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Gunratna Borkar © 2026 · Built with React · IIT Bombay</p>
    </footer>
  );
}

window.Sections = { Navbar, Hero, About, Experience, Projects, Skills, Education, Extracurriculars, Contact, Footer };
