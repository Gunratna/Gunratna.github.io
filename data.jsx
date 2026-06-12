/* ============================================================
   Content data for the portfolio + IDE modal.
   Pure data — no JSX rendering here.
   ============================================================ */

window.PORTFOLIO = {
  hero: {
    name: "Gunratna Borkar",
    meta: "Sr. AI Engineer · IIT Bombay · CAMS",
    tagline:
      "Shipping production LLM systems that process 10k+ emails/day with zero hallucination — for India's largest mutual fund registrar.",
  },

  // JSON metrics block rendered as syntax-highlighted "code" in the hero
  heroFile: "engineer.json",
  heroJSON: `{
  "engineer": "Gunratna Borkar",
  "role": "Sr. AI Engineer @ CAMS",
  "scale": {
    "emails_per_day": "10000+",
    "amcs_served": 23,
    "aum": "Rs.47L Cr+"
  },
  "shipped": {
    "triage_automated": 0.80,
    "hallucination_rate": 0.00,
    "false_negative_rate": 0.001
  },
  "stack": ["PyTorch", "LangGraph", "Gemini 2.5", "GCP"],
  "status": "shipping to production"
}`,

  about: {
    bio: [
      "I build AI systems that serve 23 asset management companies and Rs.47 lakh crore in assets under management — where a wrong answer isn't bad UX, it's a compliance incident.",
      "My work spans QLoRA fine-tuning, zero-hallucination RAG pipelines, agentic CI/CD orchestration, and GCP-native MLOps. Two years of shipping to production in one of India's most regulated industries.",
    ],
    stats: [
      { num: "2", unit: "yrs", label: "production AI" },
      { num: "23", unit: "", label: "AMCs served" },
      { num: "80", unit: "%", label: "triage automated" },
      { num: "10k", unit: "+", label: "emails/day" },
    ],
  },

  experience: [
    {
      year: "2024",
      role: "Sr. AI Engineer",
      org: "CAMS",
      orgNote: "India's largest mutual fund RTA · Rs.47L Cr+ AUM",
      period: "July 2024 – Present",
      blurb:
        "Leading LLM and ML systems that touch investor operations across 23 asset management companies — from email triage to regulatory document intelligence.",
      highlights: [
        "80% of 10k+ daily investor emails automated end-to-end",
        "0.1% false negative rate via 3-tier junk detection pipeline",
        "50% reduction in manual SEBI compliance reviews",
        "<500ms p95 latency across dual FastAPI microservices on Cloud Run",
      ],
      expandable: true,
      chips: [
        { label: "Email BOT", note: "PyTorch + Gemini 2.5 Flash · 10k+/day · 80% automated" },
        { label: "SEBI Debarred Entities", note: "~0% hallucination RAG · 50% review reduction" },
        { label: "Aadhaar PII Redaction", note: "ResNet/YOLO · DPDP Act compliance" },
        { label: "GST Invoice Extraction", note: "RapidOCR + ONNX · <1s latency" },
        { label: "GitLab Agentic Pipeline", note: "LangGraph · 5 autonomous agents [Experimental]" },
      ],
    },
    {
      year: "2023",
      role: "Data Science Intern",
      org: "Vislesha Pvt Ltd",
      orgNote: "Letter of Recommendation from CTO",
      period: "July 2023 – Sep 2023",
      blurb:
        "Built 30+ PySpark pipelines on 2M+ transaction records achieving 10× speedup. Dormancy prediction at 97% accuracy; customer segmentation via FPGrowth market basket analysis and K-means/DBSCAN clustering.",
      highlights: [
        "30+ PySpark pipelines on 2M+ transaction records · 10× speedup",
        "97% accuracy dormancy prediction model",
        "5 purchase segments via FPGrowth + K-means/DBSCAN",
      ],
      expandable: false,
      chips: [],
    },
  ],

  skills: [
    {
      group: "LLM & Agents",
      items: ["Fine-tuning (QLoRA)", "LangGraph", "PydanticAI", "LangChain", "vLLM", "RAG (FAISS)", "Gemini 2.5", "Vertex AI", "Prompt Eng", "Eval Harnesses"],
    },
    {
      group: "ML & Vision",
      items: ["PyTorch", "TensorFlow", "Transformers", "ResNet", "YOLO", "ONNX Runtime", "RapidOCR", "Tesseract", "Camelot", "scikit-learn", "OpenCV"],
    },
    {
      group: "Cloud & MLOps",
      items: ["GCP", "Cloud Run", "GKE", "Vertex AI", "Pub/Sub", "Firestore", "GCS", "Docker", "GitLab CI/CD", "FastAPI", "PostgreSQL", "Redis"],
    },
    {
      group: "Agentic AI Tools",
      items: ["LangGraph", "Claude Code", "GitHub Copilot Agent", "OpenAI Codex", "Gemini CLI", "MCP", "Vector DBs", "Pydantic", "Celery"],
    },
  ],

  education: {
    org: "Indian Institute of Technology, Bombay",
    degree: "Dual Degree (B.Tech + M.Tech)",
    dept: "Metallurgical Engineering & Material Science",
    period: "2019 – 2024",
    cpi: "Overall CPI 7.8/10 · M.Tech CPI (Year 5) 9.2/10",
    coursework: [
      "Statistical Machine Learning", "Deep Learning", "Linear Algebra",
      "Probability & Statistics", "Optimization",
      "Natural Language Processing",
    ],
  },

  extracurriculars: [
    {
      role: "Teaching Assistant",
      org: "IIT Bombay",
      desc: "Guided 120+ undergraduate students through labs and courses in a team of 6.",
    },
    {
      role: "Mentor",
      org: "Summer of Science, IIT Bombay",
      desc: "Mentored 4 students on a project focused on stock market analysis and investment strategies.",
    },
    {
      role: "Sponsorship Lead",
      org: "Edvizo",
      desc: "Led sponsorship outreach, onboarded 10+ industry partners for NLCEE program targeting 10,000+ students.",
    },
    {
      role: "NSO Vocals",
      org: "IIT Bombay",
      desc: "Completed a year-long course in Indian Classical Music.",
    },
  ],

  contact: {
    message:
      "Always glad to talk about production ML, retrieval that behaves, or the unglamorous engineering that keeps AI honest in regulated environments.",
    links: [
      { kind: "email", label: "borkargunratna400@gmail.com", href: "mailto:borkargunratna400@gmail.com" },
      { kind: "linkedin", label: "linkedin.com/in/gunratna-borkar", href: "https://linkedin.com/in/gunratna-borkar" },
      { kind: "github", label: "github.com/Gunratna", href: "https://github.com/Gunratna" },
    ],
  },
};

/* ---- Projects (cards + IDE modal payload) ---- */
window.PROJECTS = [
  {
    id: "email-bot",
    name: "Email BOT",
    tagline: "Multi-stage ML + LLM pipeline classifying and replying to 10k+ investor emails/day across 23 mutual funds.",
    outcomes: ["80% emails automated", "0.1% false negatives", "<500ms p95 latency", "10k+ emails/day"],
    tech: ["PyTorch", "QLoRA", "Gemini 2.5 Flash", "vLLM", "FastAPI", "Cloud Run", "GitLab CI/CD"],
    experimental: false,
    files: [
      {
        name: "architecture.md", icon: "diagram", kind: "flow",
        flow: {
          title: "Email triage pipeline",
          nodes: [
            { id: "in",     label: "Investor email",         sub: "IMAP ingest · 10k+/day",    type: "io" },
            { id: "rules",  label: "Rules engine",           sub: "regex · blocklist",          type: "proc" },
            { id: "clf",    label: "Junk classifier",        sub: "PyTorch ResNet + embeddings", type: "model" },
            { id: "intent", label: "Intent engine",          sub: "Gemini 2.5 Flash · JSON schema", type: "model" },
            { id: "branch", label: "Confidence ≥ 0.92?",    sub: "calibrated threshold",       type: "decision" },
            { id: "auto",   label: "Response generator",     sub: "auto-resolves 80%",          type: "model" },
            { id: "human",  label: "Human queue",            sub: "0.1% FN routed",             type: "io" },
          ],
          edges: [
            ["in", "rules"], ["rules", "clf"], ["clf", "intent"], ["intent", "branch"],
            ["branch", "auto", "yes"], ["branch", "human", "no"],
          ],
        },
      },
      {
        name: "classifier.py", icon: "py", kind: "code", lang: "python",
        code: `class ResidualBlock(nn.Module):
    """Single residual block for the junk classifier."""
    def __init__(self, dim: int):
        super().__init__()
        self.fc1 = nn.Linear(dim, dim)
        self.fc2 = nn.Linear(dim, dim)
        self.norm = nn.LayerNorm(dim)
        self.act  = nn.GELU()

    def forward(self, x):
        return self.norm(x + self.fc2(self.act(self.fc1(x))))

class JunkClassifier(nn.Module):
    """
    3-tier junk detection: Rules → ML Model → Semantic rescue.
    False negative rate: 0.1% · FP reduction: 79% vs. rules-only.
    """
    def __init__(self, embedding_dim: int = 768, n_blocks: int = 3):
        super().__init__()
        self.blocks = nn.Sequential(
            *[ResidualBlock(embedding_dim) for _ in range(n_blocks)]
        )
        self.head = nn.Linear(embedding_dim, 2)
        self.temperature = nn.Parameter(torch.ones(1))

    def forward(self, embeddings: torch.Tensor) -> torch.Tensor:
        h = self.blocks(embeddings)
        return self.head(h) / self.temperature  # calibrated logits

    @torch.inference_mode()
    def predict(self, text: str) -> dict:
        emb = embed(text)           # sentence-transformers
        probs = self.forward(emb).softmax(-1)
        conf, cls = probs.max(-1)
        return {"is_junk": bool(cls), "confidence": conf.item()}`,
      },
      {
        name: "intent_engine.py", icon: "py", kind: "code", lang: "python",
        code: `INTENT_SCHEMA = {
    "type": "object",
    "properties": {
        "intent":     {"type": "string", "enum": INTENT_CLASSES},
        "sub_intent": {"type": "string"},
        "pan":        {"type": "string"},
        "folio":      {"type": "string"},
        "arn":        {"type": "string"},
        "date":       {"type": "string"},
        "confidence": {"type": "number"},
    },
    "required": ["intent", "confidence"],
}

async def extract_intent(email_body: str) -> IntentResult:
    """
    Gemini 2.5 Flash with JSON schema enforcement.
    23 intents × 5 sub-intents · entity extraction (PAN, folio, ARN, date).
    Originally Qwen-14B QLoRA (97% macro-F1); migrated to Gemini to cut GPU infra.
    """
    response = await gemini.generate_content(
        prompt=INTENT_PROMPT.format(email=email_body),
        generation_config=GenerationConfig(
            response_mime_type="application/json",
            response_schema=INTENT_SCHEMA,
        ),
    )
    result = IntentResult.model_validate_json(response.text)
    return result`,
      },
      {
        name: "router.py", icon: "py", kind: "code", lang: "python",
        code: `AUTO_THRESHOLD = 0.92   # tuned to keep FN < 0.1%

async def route(email: Email) -> Resolution:
    # Tier 1: fast rules check
    if rules_engine.is_junk(email.raw):
        return Resolution.junk("rules")

    # Tier 2: ML junk classifier
    junk = classifier.predict(email.clean_body)
    if junk["is_junk"] and junk["confidence"] >= AUTO_THRESHOLD:
        return Resolution.junk("ml-model")

    # Tier 3: intent extraction + auto-reply
    intent = await extract_intent(email.clean_body)
    if intent.confidence >= AUTO_THRESHOLD:
        draft = await gemini.draft_reply(
            intent=intent, context=email, tone="formal-investor",
        )
        return Resolution.auto(draft, latency_ms=measure())

    # Low confidence → escalate, never guess
    return Resolution.escalate(email, reason=intent.intent)`,
      },
      {
        name: "metrics.json", icon: "json", kind: "code", lang: "json",
        code: `{
  "window": "30d rolling",
  "volume": { "emails_per_day": 10000, "amcs": 23 },
  "automation": {
    "auto_resolved": 0.80,
    "escalated": 0.20,
    "false_negative_rate": 0.001,
    "false_positive_reduction": 0.79
  },
  "latency_ms": { "p50": 210, "p95": 480, "p99": 612 },
  "infra": "dual FastAPI on Cloud Run · GitLab CI/CD"
}`,
      },
    ],
  },
  {
    id: "sebi-debarred",
    name: "SEBI Debarred Entities",
    tagline: "Automated regulatory intelligence extracting debarred PAN holders from 6K+ SEBI enforcement orders.",
    outcomes: ["50% review reduction", "~0% hallucination", "10 concurrent PDFs", "6K+ orders evaluated"],
    tech: ["FAISS", "Gemini 2.5 Flash", "Gemini Vision", "Camelot", "Cloud Run", "GKE", "Pub/Sub", "Firestore"],
    experimental: false,
    files: [
      {
        name: "architecture.md", icon: "diagram", kind: "flow",
        flow: {
          title: "Grounded retrieval pipeline",
          nodes: [
            { id: "pdf",    label: "SEBI order PDFs",       sub: "10 concurrent · Pub/Sub",       type: "io" },
            { id: "route",  label: "Document router",       sub: "text → Camelot · scan → Vision", type: "decision" },
            { id: "chunk",  label: "Layout-aware chunking", sub: "tables + clauses",               type: "proc" },
            { id: "embed",  label: "Embed + FAISS index",   sub: "page relevance scoring",         type: "proc" },
            { id: "ret",    label: "Hybrid retrieval",      sub: "dense + BM25 top-k",             type: "model" },
            { id: "guard",  label: "Citation guard",        sub: "span must exist verbatim",       type: "decision" },
            { id: "ans",    label: "Grounded answer",       sub: "Firestore + source spans",       type: "io" },
            { id: "abstain",label: "Abstain",               sub: "no fabrication",                 type: "proc" },
          ],
          edges: [
            ["pdf", "route"], ["route", "chunk"], ["chunk", "embed"],
            ["embed", "ret"], ["ret", "guard"],
            ["guard", "ans", "grounded"], ["guard", "abstain", "no span"],
          ],
        },
      },
      {
        name: "router.py", icon: "py", kind: "code", lang: "python",
        code: `class MultimodalPDFRouter:
    """
    Routes SEBI PDFs: text-based → Camelot extraction,
    scanned/image-based → Gemini Vision API.
    Evaluated on 6K+ SEBI enforcement orders.
    """

    def route(self, pdf_path: str) -> list[Chunk]:
        if self._has_text_layer(pdf_path):
            return self._extract_camelot(pdf_path)
        return self._extract_vision(pdf_path)

    def _extract_camelot(self, path: str) -> list[Chunk]:
        """Camelot for structured table + text extraction."""
        tables = camelot.read_pdf(path, pages="all", flavor="lattice")
        return [Chunk(text=t.df.to_string(), page=t.page) for t in tables]

    def _extract_vision(self, path: str) -> list[Chunk]:
        """Gemini Vision for scanned / image-heavy PDFs."""
        images = pdf_to_images(path)
        chunks = []
        for i, img in enumerate(images):
            text = gemini_vision.extract_text(img)
            chunks.append(Chunk(text=text, page=i+1))
        return chunks`,
      },
      {
        name: "retriever.py", icon: "py", kind: "code", lang: "python",
        code: `class GroundedRetriever:
    """Hybrid retrieval — every claim must cite a real span."""

    def query(self, q: str, k: int = 8) -> list[Chunk]:
        dense  = self.faiss_index.search(self.embed(q), k=k)
        sparse = self.bm25.search(q, k=k)
        return rerank(dense + sparse)[:k]

    def answer(self, q: str) -> Answer:
        chunks = self.query(q)
        draft  = gemini.generate(q, context=chunks)

        # Hard gate: drop any sentence without a verbatim source span
        verified = [s for s in draft.sentences
                    if span_exists(s, chunks)]
        if not verified:
            return Answer.abstain(q)
        return Answer(verified, citations=cite(verified, chunks))

def span_exists(sentence: str, chunks: list[Chunk]) -> bool:
    """A claim is allowed only if its text is literally in a chunk."""
    norm = normalize(sentence)
    for c in chunks:
        if fuzzy_contains(normalize(c.text), norm, thresh=0.94):
            return True
    return False  # → forces abstention, hallucination ≈ 0`,
      },
      {
        name: "schema.py", icon: "py", kind: "code", lang: "python",
        code: `class Citation(BaseModel):
    doc_id: str
    page: int
    span: tuple[int, int]   # char offsets into source text

class DebarredEntity(BaseModel):
    pan: str
    name: str
    order_date: str
    debarment_period: str
    citations: list[Citation]

class Answer(BaseModel):
    entities: list[DebarredEntity]
    abstained: bool = False
    query: str

    @classmethod
    def abstain(cls, q: str) -> "Answer":
        return cls(
            entities=[], abstained=True, query=q,
            # Forces explicit signal — never silently returns empty
        )`,
      },
    ],
  },
  {
    id: "aadhaar-redaction",
    name: "Aadhaar PII Redaction",
    tagline: "CNN + YOLO pipeline identifying and masking Aadhaar numbers in multi-page TIFFs for DPDP Act compliance.",
    outcomes: ["DPDP Act compliant", "ResNet / EfficientNet", "YOLO bounding-box", "8/12 digits masked"],
    tech: ["PyTorch", "ResNet", "EfficientNet", "YOLO", "OpenCV", "ONNX Runtime"],
    experimental: false,
    files: [
      {
        name: "architecture.md", icon: "diagram", kind: "flow",
        flow: {
          title: "Aadhaar redaction pipeline",
          nodes: [
            { id: "tiff",   label: "Multi-page TIFF",       sub: "document upload",              type: "io" },
            { id: "pages",  label: "Page extractor",        sub: "split + preprocess",           type: "proc" },
            { id: "clf",    label: "Aadhaar page classifier", sub: "ResNet/EfficientNet CNN",    type: "model" },
            { id: "detect", label: "YOLO detector",         sub: "bounding-box localization",    type: "model" },
            { id: "mask",   label: "PII masker",            sub: "first 8 of 12 digits → ████", type: "proc" },
            { id: "out",    label: "Redacted document",     sub: "DPDP Act compliant output",    type: "io" },
          ],
          edges: [
            ["tiff", "pages"], ["pages", "clf"],
            ["clf", "detect", "Aadhaar page"], ["clf", "out", "non-Aadhaar"],
            ["detect", "mask"], ["mask", "out"],
          ],
        },
      },
      {
        name: "page_classifier.py", icon: "py", kind: "code", lang: "python",
        code: `class AadhaarPageClassifier(nn.Module):
    """
    Fine-tuned CNN identifying Aadhaar pages in multi-page TIFFs.
    Backbone: ResNet-50 or EfficientNet-B3 (switchable).
    """
    def __init__(self, backbone: str = "resnet50"):
        super().__init__()
        if backbone == "resnet50":
            self.encoder = resnet50(weights="IMAGENET1K_V2")
            feat_dim = 2048
        else:
            self.encoder = efficientnet_b3(weights="IMAGENET1K_V1")
            feat_dim = 1536
        self.encoder.fc = nn.Identity()
        self.head = nn.Sequential(
            nn.Linear(feat_dim, 256), nn.ReLU(),
            nn.Dropout(0.3), nn.Linear(256, 2),
        )

    @torch.inference_mode()
    def is_aadhaar(self, image: torch.Tensor) -> tuple[bool, float]:
        feat  = self.encoder(image)
        probs = self.head(feat).softmax(-1)
        conf, cls = probs.max(-1)
        return bool(cls.item()), conf.item()`,
      },
      {
        name: "redactor.py", icon: "py", kind: "code", lang: "python",
        code: `class AadhaarRedactor:
    """
    YOLO bounding-box detection + masking of first 8 of 12 Aadhaar digits.
    DPDP Act compliance: last 4 digits retained for reference.
    """
    def __init__(self):
        self.classifier = AadhaarPageClassifier()
        self.detector   = YOLO("aadhaar_digits.pt")

    def redact_tiff(self, tiff_path: str) -> str:
        pages = load_tiff_pages(tiff_path)
        output = []
        for page_img in pages:
            is_aadh, conf = self.classifier.is_aadhaar(page_img)
            if not is_aadh:
                output.append(page_img)
                continue
            boxes = self.detector(page_img)
            redacted = self._mask_digits(page_img, boxes)
            output.append(redacted)
        return save_tiff(output)

    def _mask_digits(self, img, boxes) -> np.ndarray:
        """Mask first 8 of 12 detected digit bounding boxes."""
        digit_boxes = sorted(boxes, key=lambda b: b.x1)
        for box in digit_boxes[:8]:   # retain last 4
            cv2.rectangle(img, box.tl, box.br, (0, 0, 0), -1)
        return img`,
      },
    ],
  },
  {
    id: "gst-extraction",
    name: "GST Invoice Extraction",
    tagline: "Sub-second structured field extraction from PDF and JPEG GST invoices using RapidOCR and ONNX runtime.",
    outcomes: ["<1s end-to-end", "7 structured fields", "PDF + JPEG input", "Parallel processing"],
    tech: ["RapidOCR", "ONNX Runtime", "FastAPI", "regex", "Pydantic"],
    experimental: false,
    files: [
      {
        name: "architecture.md", icon: "diagram", kind: "flow",
        flow: {
          title: "GST invoice extraction pipeline",
          nodes: [
            { id: "in",     label: "PDF / JPEG invoice",    sub: "multi-format input",           type: "io" },
            { id: "ocr",    label: "RapidOCR",              sub: "ONNX runtime · parallel",      type: "model" },
            { id: "parse",  label: "Regex engine",          sub: "pattern-analysed rules",       type: "proc" },
            { id: "valid",  label: "Pydantic validation",   sub: "schema enforcement",           type: "proc" },
            { id: "out",    label: "Structured output",     sub: "7 fields · <1s total",         type: "io" },
          ],
          edges: [
            ["in", "ocr"], ["ocr", "parse"], ["parse", "valid"], ["valid", "out"],
          ],
        },
      },
      {
        name: "extractor.py", icon: "py", kind: "code", lang: "python",
        code: `class GSTInvoiceExtractor:
    """
    RapidOCR + ONNX runtime pipeline.
    Parallel processing · <1s end-to-end · 7 structured fields.
    """

    FIELDS = ["gstin", "invoice_no", "invoice_date",
              "supplier_name", "total_amount", "cgst", "sgst"]

    def __init__(self):
        self.ocr    = RapidOCR()           # ONNX backend
        self.engine = RegexEngine(PATTERNS)

    def extract(self, file_path: str) -> GSTInvoice:
        raw_text = self._ocr_parallel(file_path)
        fields   = self.engine.extract_all(raw_text, self.FIELDS)
        return GSTInvoice.model_validate(fields)

    def _ocr_parallel(self, path: str) -> str:
        pages = to_images(path)   # PDF → images or passthrough JPEG
        with ThreadPoolExecutor() as pool:
            texts = list(pool.map(lambda p: self.ocr(p)[0], pages))
        return "\n".join(t for t in texts if t)`,
      },
      {
        name: "schema.py", icon: "py", kind: "code", lang: "python",
        code: `import re
from pydantic import BaseModel, field_validator

class GSTInvoice(BaseModel):
    gstin:          str
    invoice_no:     str
    invoice_date:   str
    supplier_name:  str
    total_amount:   float
    cgst:           float
    sgst:           float

    @field_validator("gstin")
    @classmethod
    def validate_gstin(cls, v: str) -> str:
        pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
        if not re.match(pattern, v):
            raise ValueError(f"Invalid GSTIN: {v}")
        return v

    @field_validator("total_amount", "cgst", "sgst")
    @classmethod
    def positive(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Amount must be non-negative")
        return v`,
      },
    ],
  },
  {
    id: "gitlab-agentic",
    name: "GitLab Agentic Pipeline",
    tagline: "Five autonomous agents that decompose PRDs, write code, raise MRs, and ship — orchestrated with LangGraph.",
    outcomes: ["5 agents", "LangGraph + PydanticAI", "GitLab MR automation", "[Experimental]"],
    tech: ["LangGraph", "PydanticAI", "GitLab CI", "Claude", "MCP"],
    experimental: true,
    files: [
      {
        name: "architecture.md", icon: "diagram", kind: "flow",
        flow: {
          title: "5-agent autonomous CI/CD graph",
          nodes: [
            { id: "prd",    label: "PRD input",             sub: "GitLab webhook",               type: "io" },
            { id: "plan",   label: "Orchestrator",          sub: "PRD decomposition",            type: "model" },
            { id: "dev",    label: "Developer agent",       sub: "codes + raises MR",            type: "model" },
            { id: "rev",    label: "Reviewer agent",        sub: "static + semantic",            type: "model" },
            { id: "sec",    label: "Security agent",        sub: "vulnerability check",          type: "model" },
            { id: "gate",   label: "Human review gate",     sub: "approve / loop",               type: "decision" },
            { id: "ship",   label: "Auto-deploy",           sub: "CI/CD trigger",                type: "io" },
          ],
          edges: [
            ["prd", "plan"], ["plan", "dev"], ["dev", "rev"], ["rev", "sec"],
            ["sec", "gate"], ["gate", "ship", "pass"], ["gate", "plan", "loop"],
          ],
        },
      },
      {
        name: "graph.py", icon: "py", kind: "code", lang: "python",
        code: `from langgraph.graph import StateGraph, END

def build_pipeline() -> StateGraph:
    g = StateGraph(PipelineState)

    g.add_node("orchestrator", orchestrator_agent)
    g.add_node("developer",    developer_agent)
    g.add_node("reviewer",     reviewer_agent)
    g.add_node("security",     security_agent)
    g.add_node("supervisor",   supervisor_agent)

    g.set_entry_point("orchestrator")
    g.add_edge("orchestrator", "developer")
    g.add_edge("developer",    "reviewer")
    g.add_edge("reviewer",     "security")
    g.add_edge("security",     "supervisor")

    # supervisor decides: ship or loop back to orchestrator
    g.add_conditional_edges(
        "supervisor", route_decision,
        {"ship": END, "retry": "orchestrator"},
    )
    return g.compile()`,
      },
      {
        name: "agents.py", icon: "py", kind: "code", lang: "python",
        code: `class OrchestratorAgent(Agent):
    """Decomposes PRDs into dev tasks; coordinates all agents."""
    tools = [read_prd, create_task, assign_agent]

    def act(self, state: PipelineState) -> Plan:
        tasks = self.llm.decompose(state.prd, self.tools)
        return Plan(tasks=tasks, attempts=state.attempts + 1)

class DeveloperAgent(Agent):
    """Writes code and raises GitLab MRs via API."""
    tools = [write_file, create_mr, push_branch]

    def act(self, state: PipelineState) -> MergeRequest:
        code = self.llm.generate_code(state.plan.tasks)
        mr   = create_gitlab_mr(code, state.project)
        return mr

class SupervisorAgent(Agent):
    """Human-in-the-loop optional. Caps retry loops at 3."""
    def act(self, state: PipelineState) -> Decision:
        if state.tests_pass and state.security_score < 0.3:
            return Decision("ship")
        if state.attempts >= 3:
            return Decision("escalate")
        return Decision("retry")`,
      },
      {
        name: ".gitlab-ci.yml", icon: "yaml", kind: "code", lang: "yaml",
        code: `agentic_review:
  stage: review
  image: python:3.12
  rules:
    - if: $CI_MERGE_REQUEST_IID   # experimental flag
  script:
    - pip install -e .
    - python -m pipeline.run --mr "$CI_MERGE_REQUEST_IID"
  artifacts:
    reports:
      junit: agent-report.xml
  allow_failure: true             # not yet blocking

agentic_deploy:
  stage: deploy
  needs: [agentic_review]
  rules:
    - if: $AGENTIC_APPROVED == "true"
  script:
    - gcloud run deploy $SERVICE --image $IMAGE`,
      },
    ],
  },
];
