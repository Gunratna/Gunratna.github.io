/* ============================================================
   Single source of truth for all portfolio content.
   Every claim here is drawn directly from the resume.
   ============================================================ */

export const meta = {
  name: "Gunratna Borkar",
  role: "Sr. AI Engineer",
  institution: "IIT Bombay",
  company: "CAMS",
  email: "borkargunratna400@gmail.com",
  phone: "+91 8605154284",
  linkedin: "https://www.linkedin.com/in/gunratna-borkar-190966192/",
  github: "https://github.com/Gunratna",
  resume: "/Gunratna_Resume_08_06.pdf",
  location: "India",
  tagline:
    "Building production-grade Agentic AI systems, LLM fine-tuning pipelines, and RAG-based document intelligence — serving 23 AMCs and Rs.47L Cr+ AUM at CAMS.",
  siteUrl: "https://gunratna.github.io",
  // Paste the token from Google Search Console (HTML tag verification) here:
  googleVerification: "y1ohyxX10qJpoxuBWhT8hnyoGUKhRX0THkr5qRn8fZ4",
  /**
   * Formspree endpoint for the contact form.
   * Steps:
   *   1. Go to https://formspree.io → Sign Up (use borkargunratna400@gmail.com)
   *   2. Create New Form → name it "Portfolio Contact"
   *   3. Copy the form ID (looks like "xpznkwvd")
   *   4. Paste it below — emails will land directly in your Gmail.
   * Free tier: 50 submissions/month.
   */
  formspreeId: "xzdqjnzr", // Formspree form ID — delivers contact form submissions to borkargunratna400@gmail.com
} as const;

/* A subtle "currently" profile card — open roles shown as compact badges. */
export const profileCard = {
  openTo: ["AI Engineering", "Data Science"],
  rows: [
    { k: "Role", v: "Sr. AI Engineer @ CAMS" },
    { k: "Focus", v: "Agentic Systems · LLM Fine-Tuning · RAG" },
    { k: "Scale", v: "23 AMCs · Rs.47L Cr+ AUM" },
    { k: "Education", v: "IIT Bombay — Dual Degree" },
  ],
};

export const about = {
  bio: [
    "I'm an AI Engineer at CAMS — India's largest mutual fund registrar and transfer agent — where I build production LLM and ML systems for investor operations across 23 asset management companies.",
    "My work spans LLM/SLM fine-tuning, retrieval pipelines, and document intelligence, deployed on GCP-native MLOps. Before CAMS, I trained as a Dual Degree student at IIT Bombay and interned in data science.",
  ],
  terminalLines: [
    "$ whoami",
    "gunratna — sr. ai engineer @ cams",
    "$ cat focus.txt",
    "agentic systems · llm fine-tuning · rag · document intelligence",
    "$ cat scale.txt",
    "23 AMCs · Rs.47L Cr+ AUM · 10k+ emails/day",
  ],
  stats: [
    { value: 10, suffix: "k+", label: "Emails / day processed" },
    { value: 23, suffix: "", label: "AMCs served" },
    { value: 80, suffix: "%", label: "Manual triage automated" },
    { value: 6, suffix: "K+", label: "SEBI orders evaluated" },
  ],
};

/* No proficiency levels — grouped exactly as the resume lists them. */
export const skills: { group: string; items: string[] }[] = [
  {
    group: "LLM & Agents",
    items: ["Fine-tuning (QLoRA)", "LangGraph", "PydanticAI", "LangChain", "vLLM", "RAG"],
  },
  {
    group: "ML / Vision",
    items: [
      "PyTorch",
      "TensorFlow",
      "ResNet",
      "YOLO",
      "ONNX Runtime",
      "RapidOCR",
      "Tesseract",
      "Camelot",
    ],
  },
  {
    group: "Cloud / MLOps",
    items: [
      "GCP",
      "Cloud Run",
      "GKE",
      "Vertex AI",
      "Pub/Sub",
      "Firestore",
      "GCS",
      "Docker",
      "GitLab CI/CD",
      "FastAPI",
    ],
  },
  {
    group: "Agentic AI Tools",
    items: [
      "Claude Code",
      "GitHub Copilot Agent",
      "OpenAI Codex",
      "Gemini CLI",
      "Google Antigravity",
    ],
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  note?: string;
  description: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: "CAMS",
    role: "Sr. AI Engineer",
    period: "Jul 2024 — Present",
    note: "India's largest RTA · 23 AMCs · Rs.47L Cr+ AUM",
    description:
      "Building production-grade Agentic AI systems, LLM fine-tuning pipelines, and RAG-based document intelligence for investor operations.",
    highlights: [
      "Email BOT: multi-stage ML + LLM agentic pipeline processing 10k+ investor emails/day, automating 80% of manual triage",
      "SEBI Debarred Entities: RAG pipeline for regulatory document intelligence, 50% reduction in manual reviews",
      "Aadhaar PII Redaction & GST Invoice Extraction: computer-vision pipelines for compliance and OCR",
      "GitLab Agentic Pipeline: 5-agent autonomous CI/CD system via LangGraph + PydanticAI [Experimental]",
    ],
  },
  {
    company: "Vislesha Pvt Ltd",
    role: "Data Science Intern",
    period: "Jul 2023 — Sep 2023",
    note: "Letter of Recommendation from the CTO",
    description:
      "Built data pipelines and predictive models on large transaction datasets, with customer segmentation analysis.",
    highlights: [
      "30+ PySpark pipelines on 2M+ transaction records with 10× speedup",
      "Dormancy prediction model at 97% accuracy",
      "5 key purchase segments via FPGrowth market basket analysis and K-means/DBSCAN clustering",
    ],
  },
  {
    company: "Edvizo",
    role: "Sponsorship Intern",
    period: "2022",
    note: "",
    description:
      "Led sponsorship outreach for NLCEE, a national-level career exploration and education program.",
    highlights: [
      "Onboarded 10+ industry partners as sponsors",
      "NLCEE program reached 10,000+ students nationally",
    ],
  },
];

export type ArchNode = {
  id: string;
  label: string;
  sub: string;
  kind: "io" | "process" | "model" | "decision" | "store";
};

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  year: number;
  type: "LLM" | "Vision" | "Agentic" | "RAG";
  featured: boolean;
  experimental?: boolean;
  outcomes: { label: string; value: string }[];
  tech: string[];
  details: string[];
  github?: string;
  arch: { nodes: ArchNode[]; edges: [string, string, string?][]; caption: string };
};

export const projects: Project[] = [
  {
    id: "email-bot",
    name: "Email BOT",
    subtitle: "Investor email triage at scale",
    tagline:
      "Multi-stage ML + LLM pipeline classifying and replying to investor emails for 23 mutual funds.",
    year: 2024,
    type: "LLM",
    featured: true,
    outcomes: [
      { label: "Emails / day", value: "10k+" },
      { label: "Triage automated", value: "80%" },
      { label: "False negatives", value: "0.1%" },
      { label: "FP reduction", value: "79%" },
    ],
    tech: ["PyTorch", "QLoRA", "Qwen-14B", "vLLM", "Gemini 2.5 Flash", "FastAPI", "Cloud Run"],
    details: [
      "Junk Classifier: custom PyTorch residual network with sentence embeddings; 0.1% false negative rate via a 3-tier pipeline (Rules → ML Model → Semantic rescue), cutting false positives by 79% (80% → 16.8%) compared to rules alone.",
      "Intent Engine: 4-bit QLoRA fine-tuned Qwen-14B (vLLM, 97% macro-F1); migrated to Gemini 2.5 Flash with JSON schema enforcement, extracting PAN, folios, ARNs, and dates across 23 intents × 5 sub-intents — eliminating GPU infrastructure.",
      "Deployment: dual FastAPI microservices integrated with Cloud Run via GitLab CI/CD; <500ms p95 latency.",
    ],
    arch: {
      caption:
        "Investor mail flows through a 3-tier junk filter, then a schema-constrained intent engine. Low-confidence items escalate to humans.",
      nodes: [
        { id: "in", label: "Investor email", sub: "ingest · 10k+/day", kind: "io" },
        { id: "rules", label: "Rules engine", sub: "tier 1 filter", kind: "process" },
        { id: "junk", label: "Junk classifier", sub: "PyTorch residual net", kind: "model" },
        { id: "intent", label: "Intent engine", sub: "Gemini 2.5 Flash · JSON", kind: "model" },
        { id: "gate", label: "Confidence gate", sub: "auto vs escalate", kind: "decision" },
        { id: "reply", label: "Auto reply", sub: "80% resolved", kind: "io" },
        { id: "human", label: "Human queue", sub: "escalation", kind: "io" },
      ],
      edges: [
        ["in", "rules"],
        ["rules", "junk"],
        ["junk", "intent"],
        ["intent", "gate"],
        ["gate", "reply", "auto"],
        ["gate", "human", "escalate"],
      ],
    },
  },
  {
    id: "sebi-debarred",
    name: "SEBI Debarred Entities",
    subtitle: "Regulatory document intelligence",
    tagline:
      "Automated pipeline extracting debarred PAN holders from SEBI enforcement orders.",
    year: 2024,
    type: "RAG",
    featured: true,
    outcomes: [
      { label: "Review reduction", value: "50%" },
      { label: "Orders evaluated", value: "6K+" },
      { label: "Concurrent PDFs", value: "10" },
      { label: "Outputs", value: "Schema-constrained" },
    ],
    tech: ["FAISS", "Gemini 2.5 Flash", "Gemini Vision", "Camelot", "Cloud Run", "GKE", "Pub/Sub", "Firestore"],
    details: [
      "RAG Pipeline: FAISS-based page relevance scoring on SEBI document patterns, feeding context into Gemini 2.5 Flash.",
      "Document Routing: multimodal PDF routing using Camelot for text-based documents and Gemini Vision for scanned documents.",
      "Infrastructure: token-optimized, event-driven pipeline integrated with Cloud Run, GKE, Pub/Sub, and Firestore.",
    ],
    arch: {
      caption:
        "Event-driven pipeline routes each PDF by type, scores page relevance with FAISS, and returns schema-constrained extractions.",
      nodes: [
        { id: "pdf", label: "SEBI order PDF", sub: "Pub/Sub · 10 concurrent", kind: "io" },
        { id: "route", label: "Document router", sub: "text vs scanned", kind: "decision" },
        { id: "camelot", label: "Camelot", sub: "text extraction", kind: "process" },
        { id: "vision", label: "Gemini Vision", sub: "scanned OCR", kind: "model" },
        { id: "faiss", label: "FAISS scoring", sub: "page relevance", kind: "store" },
        { id: "gen", label: "Gemini 2.5 Flash", sub: "schema-constrained", kind: "model" },
        { id: "out", label: "Debarred PANs", sub: "Firestore", kind: "store" },
      ],
      edges: [
        ["pdf", "route"],
        ["route", "camelot", "text"],
        ["route", "vision", "scanned"],
        ["camelot", "faiss"],
        ["vision", "faiss"],
        ["faiss", "gen"],
        ["gen", "out"],
      ],
    },
  },
  {
    id: "aadhaar-redaction",
    name: "Aadhaar PII Redaction",
    subtitle: "DPDP Act compliance",
    tagline:
      "Fine-tuned CNN + YOLO pipeline masking Aadhaar numbers in multi-page TIFFs.",
    year: 2024,
    type: "Vision",
    featured: false,
    outcomes: [
      { label: "Compliance", value: "DPDP Act" },
      { label: "Backbone", value: "ResNet / EfficientNet" },
      { label: "Detection", value: "YOLO" },
      { label: "Masking", value: "First 8 of 12" },
    ],
    tech: ["PyTorch", "ResNet", "EfficientNet", "YOLO", "OpenCV"],
    details: [
      "Fine-tuned CNN (ResNet / EfficientNet) identifies Aadhaar pages within multi-page TIFFs.",
      "YOLO bounding-box detection localizes digits; masks the first 8 of 12 Aadhaar digits for DPDP Act compliance.",
    ],
    arch: {
      caption:
        "A classifier flags Aadhaar pages, YOLO localizes the digits, and the first eight are masked before output.",
      nodes: [
        { id: "tiff", label: "Multi-page TIFF", sub: "document input", kind: "io" },
        { id: "clf", label: "Page classifier", sub: "ResNet / EfficientNet", kind: "model" },
        { id: "yolo", label: "YOLO detector", sub: "digit bounding boxes", kind: "model" },
        { id: "mask", label: "Mask", sub: "first 8 of 12 digits", kind: "process" },
        { id: "out", label: "Redacted doc", sub: "DPDP compliant", kind: "io" },
      ],
      edges: [
        ["tiff", "clf"],
        ["clf", "yolo", "aadhaar"],
        ["clf", "out", "other"],
        ["yolo", "mask"],
        ["mask", "out"],
      ],
    },
  },
  {
    id: "gst-extraction",
    name: "GST Invoice Extraction",
    subtitle: "Sub-second field extraction",
    tagline:
      "RapidOCR + ONNX pipeline extracting structured fields from PDF and JPEG invoices.",
    year: 2024,
    type: "Vision",
    featured: false,
    outcomes: [
      { label: "Latency", value: "<1s" },
      { label: "Fields", value: "7" },
      { label: "Input", value: "PDF / JPEG" },
      { label: "Processing", value: "Parallel" },
    ],
    tech: ["RapidOCR", "ONNX Runtime", "FastAPI"],
    details: [
      "RapidOCR + ONNX runtime pipeline with parallel processing achieving <1s end-to-end latency.",
      "Pattern-analysed regex engine extracting 7 structured fields from PDF / JPEG invoices.",
    ],
    arch: {
      caption:
        "Invoices are OCR'd in parallel via ONNX, then a regex engine extracts seven structured fields in under a second.",
      nodes: [
        { id: "in", label: "PDF / JPEG", sub: "invoice input", kind: "io" },
        { id: "ocr", label: "RapidOCR", sub: "ONNX · parallel", kind: "model" },
        { id: "regex", label: "Regex engine", sub: "pattern-analysed", kind: "process" },
        { id: "out", label: "7 fields", sub: "<1s end-to-end", kind: "io" },
      ],
      edges: [
        ["in", "ocr"],
        ["ocr", "regex"],
        ["regex", "out"],
      ],
    },
  },
  {
    id: "gitlab-agentic",
    name: "GitLab Agentic Pipeline",
    subtitle: "Experimental autonomous CI/CD",
    tagline:
      "5-agent autonomous CI/CD system that decomposes PRDs, raises MRs, and deploys after human review.",
    year: 2025,
    type: "Agentic",
    featured: true,
    experimental: true,
    outcomes: [
      { label: "Agents", value: "5" },
      { label: "Framework", value: "LangGraph + PydanticAI" },
      { label: "Gate", value: "Human review" },
      { label: "Status", value: "Experimental" },
    ],
    tech: ["LangGraph", "PydanticAI", "GitLab API"],
    details: [
      "5-agent autonomous CI/CD system via LangGraph + PydanticAI.",
      "Orchestrator decomposes PRDs → developer agent codes and raises GitLab MRs → reviewer + security agents coordinate via MR comments → auto-deploys after human review.",
    ],
    github: "https://github.com/Gunratna",
    arch: {
      caption:
        "An orchestrator decomposes the PRD; specialised agents code, review, and secure changes before a human approves deploy.",
      nodes: [
        { id: "prd", label: "PRD", sub: "input spec", kind: "io" },
        { id: "orch", label: "Orchestrator", sub: "decomposes tasks", kind: "model" },
        { id: "dev", label: "Developer agent", sub: "codes · raises MR", kind: "model" },
        { id: "rev", label: "Reviewer + Security", sub: "MR comments", kind: "model" },
        { id: "human", label: "Human review", sub: "approval gate", kind: "decision" },
        { id: "deploy", label: "Auto-deploy", sub: "post approval", kind: "io" },
      ],
      edges: [
        ["prd", "orch"],
        ["orch", "dev"],
        ["dev", "rev"],
        ["rev", "human"],
        ["human", "deploy", "approved"],
        ["human", "orch", "changes"],
      ],
    },
  },
];

export const education = {
  institution: "Indian Institute of Technology, Bombay",
  degree: "Dual Degree (B.Tech + M.Tech)",
  period: "2019 — 2024",
  coursework: [
    "Statistical Machine Learning",
    "Deep Learning",
    "Linear Algebra",
    "Probability & Statistics",
    "Optimization",
  ],
};

export type ExtraCat = {
  category: string;
  icon: string;
  items: string[];
};

export const extracurriculars: ExtraCat[] = [
  {
    category: "Sports",
    icon: "🏏",
    items: [
      "1st position in Cricket League — outperformed 10+ teams from the MEMS department ['23]",
      "3rd position in department Treasure Hunt — outperformed 20+ teams ['22]",
    ],
  },
  {
    category: "Volunteering",
    icon: "🤝",
    items: [
      "Teaching Assistant, IIT Bombay — guided 120+ undergraduate students through labs and courses in a team of 6",
      "Mentored 4 students at Summer of Science on stock market analysis and investment strategies ['22]",
      "Managed crowd of 5000+ at Half Marathon organised by Team Zero Waste, IIT Bombay ['19]",
    ],
  },
  {
    category: "Culturals",
    icon: "🎵",
    items: [
      "Completed a year-long course in Indian Classical Music under NSO Vocals, IIT Bombay ['19]",
    ],
  },
  {
    category: "Misc",
    icon: "📌",
    items: [
      "Presented a research poster to a panel of professors at Metals and Materials Summit, IIT Bombay ['22]",
      "Completed Finance Bootcamp by Learners Space, IIT Bombay — analysed the Indian Passenger Vehicle Industry using Porter's Five Forces Model",
    ],
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
