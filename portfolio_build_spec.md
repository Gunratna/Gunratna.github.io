# Portfolio Website — Build Specification
**Gunratna Borkar · Sr. AI Engineer**  
Stack: React 18 + Vite 5 · Deployed free on GitHub Pages  
Last updated: June 2026

---

## 0. Overview & Constraints

- **Zero cost**: GitHub Pages (hosting) + Google Drive (resume PDF) + Formspree free tier (optional contact form, 50/mo limit — or just mailto)
- **No backend, no DB, no auth**
- **Single repo**: `Gunratna/gunratna.github.io` → auto-publishes to `https://gunratna.github.io`
- **Design source**: Use the Claude design artifact as visual reference. Implement it faithfully.
- All site content lives in `/src/data/content.js` — one file, easy to update without touching components.

---

## 1. Project Setup

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install
npm install react-router-dom framer-motion react-syntax-highlighter lucide-react
npm install -D gh-pages tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

### Tailwind config (`tailwind.config.js`)
Enable dark mode via class strategy (not media query — you need manual toggle):
```js
darkMode: 'class'
```

### Google Fonts (`index.html` head)
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 2. Folder Structure

```
portfolio/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Education.jsx
│   │   │   └── Contact.jsx
│   │   └── ui/
│   │       ├── IdeModal.jsx         ← VS Code-like popup
│   │       ├── ThemeToggle.jsx
│   │       ├── ProjectCard.jsx
│   │       └── SectionWrapper.jsx   ← Consistent section padding
│   ├── data/
│   │   └── content.js               ← ALL site content here
│   ├── hooks/
│   │   └── useTheme.js              ← Theme persistence
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

---

## 3. Content Data File (`/src/data/content.js`)

This is the single source of truth. The AI building the site must populate it with the content below. Components must pull from here — no hardcoded strings in JSX.

```js
export const meta = {
  name: "Gunratna Borkar",
  role: "Sr. AI Engineer",
  institution: "IIT Bombay",
  email: "borkargunratna400@gmail.com",
  linkedin: "https://www.linkedin.com/in/gunratna-borkar-190966192/",
  github: "https://github.com/Gunratna",
  resumeDriveLink: "REPLACE_WITH_GOOGLE_DRIVE_LINK",  // ← fill after uploading PDF
  heroTagline: "Building production LLM pipelines and RAG systems for financial services.",
  heroStats: {
    emails_automated: "80%",
    false_negatives: "0.1%",
    models_used: ["Qwen-14B", "Gemini 2.5 Flash"],
    infra: "GCP"
  }
}

export const about = {
  paragraph: "Sr. AI Engineer at CAMS with 2 years building production-grade LLM and ML systems for India's largest Registrar & Transfer Agent. IIT Bombay dual degree with deep focus on applied ML, RAG pipelines, and GCP-native deployment.",
  quickStats: [
    { value: "2", label: "Years Production AI" },
    { value: "23", label: "AMCs Served" },
    { value: "80%", label: "Triage Automated" }
  ]
}

export const experience = [
  {
    company: "CAMS",
    role: "Sr. AI Engineer",
    period: "July 2024 – Present",
    description: "GCP-led AI initiative for India's largest RTA — LLM pipelines, RAG systems, and document intelligence serving 23 AMCs and Rs.47L Cr+ AUM.",
    projects: ["email-bot", "sebi", "other"]  // links to project IDs below
  },
  {
    company: "Vislesha Pvt Ltd",
    role: "Data Science Intern",
    period: "July 2023 – Sep 2023",
    description: "PySpark analytics on 2M+ transaction records, dormancy prediction at 97% accuracy, customer segmentation via FPGrowth and K-means/DBSCAN.",
    projects: []
  }
]

export const projects = [
  {
    id: "email-bot",
    name: "Email BOT",
    subtitle: "Automated Investor Email Processing",
    tagline: "Multi-stage ML + LLM pipeline for investor email triage across 23 mutual funds.",
    outcomes: [
      { label: "Emails Automated", value: "80%" },
      { label: "False Negatives", value: "0.1%" },
      { label: "Latency p95", value: "<500ms" }
    ],
    techTags: ["PyTorch", "QLoRA", "Qwen-14B", "Gemini 2.5 Flash", "vLLM", "FastAPI", "Cloud Run"],
    architecture: {
      // SVG diagram data — described as a flow with these stages:
      // Email Ingestion → Rules Engine → ML Junk Classifier (PyTorch Residual Net)
      //   → [Junk Path] → Discard
      //   → [Valid Path] → Intent Engine (Qwen-14B via vLLM → Gemini 2.5 Flash)
      //                  → Entity Extraction (PAN, Folio, ARN, Date)
      //                  → Response Generator → Email Reply
      // Deployment: FastAPI × 2 microservices on Cloud Run, GitLab CI/CD 12-stage
      stages: [
        "Email Ingestion",
        "Rules Engine",
        "Junk Classifier (PyTorch ResNet + sentence embeddings)",
        "Intent Engine (Qwen-14B QLoRA → Gemini 2.5 Flash)",
        "Entity Extraction",
        "Response Generator"
      ],
      description: "3-tier junk detection pipeline feeds valid emails into a dual-stage intent engine. Originally self-hosted Qwen-14B via vLLM; migrated to Gemini 2.5 Flash to eliminate GPU infra."
    },
    codeFiles: [
      {
        filename: "classifier.py",
        language: "python",
        // skeleton showing: ResidualBlock class, SentenceEmbedder, JunkClassifier model, 
        // 3-tier pipeline logic (rules → ml → semantic fallback)
        description: "Junk classifier: PyTorch residual network + sentence embeddings, 3-tier pipeline"
      },
      {
        filename: "intent_engine.py",
        language: "python",
        description: "Intent extraction: JSON schema enforcement, entity parsing (PAN, folio, ARN, dates)"
      },
      {
        filename: "api.py",
        language: "python",
        description: "FastAPI microservice: endpoints for junk check + intent classification"
      },
      {
        filename: "architecture.md",
        language: "markdown",
        description: "System overview — show SVG diagram here instead of code"
      }
    ]
  },
  {
    id: "sebi",
    name: "SEBI Debarred Entities",
    subtitle: "Regulatory Document Intelligence System",
    tagline: "Automated pipeline extracting debarred PAN holders from SEBI enforcement orders.",
    outcomes: [
      { label: "Manual Review Reduction", value: "50%" },
      { label: "Concurrent PDFs", value: "10" },
      { label: "Hallucination Rate", value: "~0%" }
    ],
    techTags: ["FAISS", "Gemini 2.5 Flash", "Camelot", "Gemini Vision", "Cloud Run", "GKE", "Pub/Sub", "Firestore"],
    architecture: {
      stages: [
        "PDF Ingestion (Cloud Storage)",
        "Document Router (Multimodal)",
        "Text PDF → Camelot extraction",
        "Scanned PDF → Gemini Vision API",
        "FAISS Page Relevance Scoring",
        "RAG Context Builder",
        "Gemini 2.5 Flash (JSON Schema enforced)",
        "Entity Validation + Output (Firestore)"
      ],
      description: "Event-driven pipeline on Pub/Sub. Multimodal routing handles both text-based and scanned SEBI orders. FAISS scores page relevance before feeding context to Gemini."
    },
    codeFiles: [
      {
        filename: "router.py",
        language: "python",
        description: "Multimodal PDF router: Camelot for text PDFs, Gemini Vision for scanned"
      },
      {
        filename: "rag_pipeline.py",
        language: "python",
        description: "FAISS page scoring + context assembly + Gemini 2.5 Flash extraction"
      },
      {
        filename: "schema.py",
        language: "python",
        description: "Pydantic schema for debarred entity output — enforces JSON validation"
      },
      {
        filename: "architecture.md",
        language: "markdown",
        description: "System overview — show SVG diagram here"
      }
    ]
  },
  {
    id: "gitlab-agent",
    name: "GitLab Agentic Pipeline",
    subtitle: "Experimental Autonomous CI/CD System",
    tagline: "5-agent LangGraph system that decomposes PRDs into code, raises MRs, and auto-deploys.",
    outcomes: [
      { label: "Agents", value: "5" },
      { label: "Framework", value: "LangGraph" },
      { label: "Status", value: "Experimental" }
    ],
    techTags: ["LangGraph", "PydanticAI", "GitLab API", "FastAPI"],
    architecture: {
      stages: [
        "PRD Input",
        "Orchestrator Agent (PRD decomposition)",
        "Developer Agent (code generation + GitLab MR)",
        "Reviewer Agent (MR comment analysis)",
        "Security Agent (vulnerability check)",
        "Human Review Gate",
        "Auto-deploy (CI/CD trigger)"
      ],
      description: "Orchestrator decomposes PRDs into tasks. Developer agent writes code and raises MRs. Reviewer and security agents coordinate via MR comments. Deploys post human approval."
    },
    codeFiles: [
      {
        filename: "orchestrator.py",
        language: "python",
        description: "LangGraph orchestrator: PRD decomposition and agent coordination"
      },
      {
        filename: "developer_agent.py",
        language: "python",
        description: "Developer agent: code generation + GitLab MR creation via API"
      },
      {
        filename: "reviewer_agent.py",
        language: "python",
        description: "Reviewer + security agents: MR comment parsing and approval logic"
      },
      {
        filename: "architecture.md",
        language: "markdown",
        description: "System overview — show SVG diagram here"
      }
    ]
  }
]

export const skills = [
  {
    group: "LLM & Agents",
    items: ["Fine-tuning (QLoRA)", "LangGraph", "PydanticAI", "LangChain", "vLLM", "RAG (FAISS)", "Gemini/Vertex AI"]
  },
  {
    group: "ML / Vision",
    items: ["PyTorch", "TensorFlow", "ResNet", "YOLO", "ONNX Runtime", "RapidOCR", "Tesseract", "Camelot"]
  },
  {
    group: "Cloud / MLOps",
    items: ["Cloud Run", "GKE", "Vertex AI", "Pub/Sub", "Firestore", "GCS", "Docker", "GitLab CI/CD", "FastAPI"]
  },
  {
    group: "Agentic AI Tools",
    items: ["Claude Code", "GitHub Copilot Agent", "OpenAI Codex", "Gemini CLI", "Google Antigravity"]
  }
]

export const education = {
  institution: "IIT Bombay",
  degree: "Dual Degree (B.Tech + M.Tech)",
  department: "Metallurgical Engineering & Material Science",
  years: "2019 – 2024",
  overallCPI: "7.8/10",
  mtechCPI: "9.2/10 (Year 5)",
  coursework: [
    "Statistical Machine Learning & Data Mining",
    "Deep Learning",
    "Linear Algebra",
    "Probability & Statistics",
    "Simulation & Optimization"
  ]
}

export const extracurriculars = [
  "Teaching Assistant, IIT Bombay — guided 120+ undergraduate students through labs and courses",
  "Mentored 4 students at Summer of Science on stock market analysis and investment strategies",
  "Led sponsorship outreach at Edvizo, onboarded 10+ industry partners for NLCEE (10,000+ students)",
  "Completed a year-long course in Indian Classical Music under NSO Vocals, IIT Bombay"
]
```

---

## 4. Component Specifications

### `useTheme.js`
- Read from `localStorage` on load; default to OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`
- Toggle adds/removes `dark` class on `document.documentElement`
- Persist choice to `localStorage` as `'theme'`

### `Navbar.jsx`
- Fixed position, `z-50`
- On scroll > 50px: add `bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm`
- Smooth scroll to section IDs on link click (use `scrollIntoView({ behavior: 'smooth' })`)
- Mobile: hamburger → slide-down menu (no overlay, just drop-down within nav)
- Theme toggle: sun/moon icon from `lucide-react`, top-right of nav

### `Hero.jsx`
- Two-column flex on desktop, single column on mobile
- Left: Fraunces serif name (4xl+), role/institution in small-caps, tagline, two CTAs
- Right: Monospace JSON block — style it like VS Code JSON with proper syntax highlighting colors. Use `react-syntax-highlighter` with `vscDarkPlus` theme. The JSON is the `heroStats` object from content.js
- No animations on load — just clean render. Framer Motion fade-in (opacity 0→1, 0.4s) is acceptable for the text block only.

### `IdeModal.jsx` — CRITICAL COMPONENT
This is the most complex component. Spec precisely:

**Structure:**
```
[Full-screen overlay: bg-black/60 backdrop-blur-sm]
  [Modal: 90vw × 85vh, dark theme always (#1E1E1E bg)]
    [Title bar: "● ● ●" dots left, project name center, X button right]
    [Tab bar: file tabs, active tab highlighted]
    [Body: two-panel flex]
      [Left panel: 220px, file tree]
        [Each file: icon + filename, click to switch active tab/content]
      [Right panel: flex-1, content area]
        [If architecture.md selected: render SVG architecture diagram]
        [If code file selected: react-syntax-highlighter with vscDarkPlus]
    [Status bar: bottom, shows language + filename in VS Code style]
```

**SVG Architecture Diagram (for architecture.md tab):**
- Build as a React component receiving the `stages` array from content.js
- Render as a vertical flowchart: each stage is a rounded rectangle, connected by arrows
- Keep it simple: no library needed, pure SVG
- Colors: `#264F78` for process boxes, `#4EC9B0` for data stores, `#DCDCAA` for decisions
- This component is reusable — same component renders different diagrams per project

**Opening/closing:** 
- State in `Projects.jsx`: `const [openModal, setOpenModal] = useState(null)`
- Pass project ID to modal, modal looks up project data from content.js
- ESC key closes modal
- Click outside modal content closes modal

### `ProjectCard.jsx`
- Border-left with accent color (4px), not full border, not shadow box
- Project name bold, subtitle muted italic below
- Outcome pills: `bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300` — small, rounded-full
- Tech tags: `font-mono text-xs bg-neutral-100 dark:bg-neutral-800` — monospace, muted
- Two buttons stacked on mobile, side by side on desktop

### `Skills.jsx`
- Map over `skills` array
- Each group: left label (`font-medium text-sm text-muted`) + right flex-wrap of chips
- Chips: `font-mono text-xs border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded`
- NO color coding chips. All same neutral style.
- Separate groups with a thin `border-b` line

### `Experience.jsx`
- Left vertical line: `border-l-2 border-neutral-200 dark:border-neutral-700`
- Year dot: small filled circle on the line
- Company name: `font-semibold`, role: `italic text-muted`, dates: right-aligned `text-sm`
- If `projects.length > 0`: show a "Projects ▾" expand button
- Expanded: chips that scroll to the correct project card (use `document.getElementById(id).scrollIntoView()`)

---

## 5. Theme System

```css
/* globals.css */
:root {
  --bg: #FAFAF8;
  --text: #111110;
  --accent: #4338CA;
  --muted: #6B7280;
  --border: #E5E5E3;
}

.dark {
  --bg: #111110;
  --text: #F5F4F0;
  --accent: #818CF8;
  --muted: #9CA3AF;
  --border: #27272A;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

Use Tailwind `dark:` variants throughout. The `dark` class on `<html>` drives everything.

---

## 6. Performance Rules

- **No useEffect for animations** — use Framer Motion's `whileInView` with `once: true` for scroll reveals. Max: fade-in only (no slide, no scale)
- **No image heavy sections** — no hero images, no project screenshots (they don't exist yet)
- **Lazy load nothing** — site is small enough to bundle entirely. No React.lazy needed.
- **react-syntax-highlighter**: import only the languages you need to keep bundle size small:
  ```js
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
  import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
  // Import only needed languages:
  import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
  import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
  ```
- **Smooth scroll**: Use CSS `scroll-behavior: smooth` on `html`, not JS for every link
- **Modal**: Use `position: fixed` not portal — simpler and sufficient

---

## 7. Mobile Responsiveness Checklist

- [ ] Navbar: hamburger at `md` breakpoint
- [ ] Hero: stacked single column, JSON block hidden on mobile (it's decoration)
- [ ] Projects: single column cards, full-width
- [ ] IDE Modal: 98vw × 95vh, file tree collapses to horizontal tab row on mobile
- [ ] Skills: chips wrap naturally
- [ ] Contact: stacked links

---

## 8. vite.config.js for GitHub Pages

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Use '/' if repo is username.github.io, else use '/repo-name/'
})
```

### package.json additions
```json
{
  "homepage": "https://gunratna.github.io",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## 9. GitHub Actions (Recommended — auto-deploys on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 10. Google Drive Resume Setup

1. Upload `Gunratna_Borkar_Resume.pdf` to Google Drive
2. Right-click → Share → "Anyone with the link" → Viewer
3. Copy the share link. It looks like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
4. To make it open directly (not preview): change `/view` to `/preview` in the URL for embedded viewing, or use as-is for download link
5. Paste this URL into `content.js` at `meta.resumeDriveLink`

The "View Resume" button in Hero should open this link in a new tab (`target="_blank"`).

---

## 11. Code Skeleton Content (for IdeModal)

For each project, the AI generating the site must write realistic Python skeletons (not lorem ipsum). The skeletons should show:
- Class/function names that match the real system
- Proper imports (torch, langchain, faiss, fastapi, etc.)
- Docstrings explaining what each function does
- Type hints
- `pass` or `...` for implementation bodies
- Roughly 30-60 lines per file — enough to show structure, not so much it overwhelms

Example skeleton style:
```python
from fastapi import FastAPI
from pydantic import BaseModel
import torch

class JunkClassifier(torch.nn.Module):
    """
    3-tier junk detection: Rules → ML Model → Semantic rescue.
    False negative rate: 0.1% (non-junk classified as junk).
    """
    def __init__(self, embedding_dim: int = 768):
        super().__init__()
        # ResidualBlock layers here
        ...

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        ...

def classify_email(email_text: str) -> dict:
    """Returns {"is_junk": bool, "confidence": float, "tier": str}"""
    ...
```

---

## 12. SEO & Meta Tags (`index.html`)

```html
<meta name="description" content="Gunratna Borkar — Sr. AI Engineer at CAMS, IIT Bombay. LLM pipelines, RAG systems, GCP deployment.">
<meta property="og:title" content="Gunratna Borkar | AI Engineer">
<meta property="og:description" content="Production-grade LLM and ML systems for financial services.">
<meta name="robots" content="index, follow">
<title>Gunratna Borkar | AI Engineer</title>
```

---

## 13. Final QA Before Deploy

- [ ] Both light and dark theme work without flash on load (add `<script>` in head to read localStorage before React mounts)
- [ ] All 3 IDE modals open, file switching works, ESC closes
- [ ] Resume link opens Google Drive in new tab
- [ ] All nav links scroll to correct sections
- [ ] Mobile: test at 375px (iPhone SE) — nothing overflows
- [ ] No console errors in production build (`npm run build && npm run preview`)
- [ ] GitHub Actions workflow triggers on push to main
