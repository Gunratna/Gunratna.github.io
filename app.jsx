/* ============================================================
   App root — theme management, IDE modal state, scroll reveal.
   ============================================================ */
const { useState: useAppState, useEffect: useAppEffect, useCallback: useAppCb } = React;

function App() {
  const [theme, setTheme] = useAppState(() => {
    try { return localStorage.getItem("gb-theme") || "light"; } catch (e) { return "light"; }
  });
  const [activeProject, setActiveProject] = useAppState(null);

  // apply + persist theme
  useAppEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("gb-theme", theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = useAppCb(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  // scroll reveal — manual visibility check (robust across preview iframes)
  useAppEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    let raf = 0;
    const reveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.classList.add("in");
          els.splice(i, 1);
        }
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(reveal); };
    // initial passes to catch above-the-fold content after layout/fonts settle
    reveal();
    requestAnimationFrame(reveal);
    const t = setTimeout(reveal, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t); cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const S = window.Sections;
  return (
    <React.Fragment>
      <S.Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <S.Hero />
        <S.About />
        <S.Experience />
        <S.Projects onOpenIDE={setActiveProject} />
        <S.Skills />
        <S.Education />
        <S.Extracurriculars />
        <S.Contact />
      </main>
      <S.Footer />
      {activeProject && <window.IDEModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
