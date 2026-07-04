import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { meta } from "@/lib/content";
import { QualityProvider } from "@/components/providers/QualityProvider";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: {
    default: `${meta.name} — AI Engineer | IIT Bombay`,
    template: `%s | ${meta.name}`,
  },
  description: meta.tagline,
  keywords: [
    "Gunratna Borkar",
    "Gunratna",
    "Gunratna Borkar IIT Bombay",
    "Gunratna IITB",
    "Gunratna Borkar AI Engineer",
    "Gunratna Borkar portfolio",
    "Gunratna Borkar CAMS",
    "AI Engineer portfolio",
    "AI Engineer IIT Bombay",
    "Agentic AI Engineer",
    "LLM Engineer",
    "LLM fine-tuning",
    "VLM fine-tuning",
    "Vision-Language Models",
    "RAG pipelines",
    "Machine Learning Engineer",
    "Data Scientist IIT Bombay",
    "MLOps",
    "PyTorch",
    "LangGraph",
    "IIT Bombay AI",
    "CAMS AI Engineer",
  ],
  authors: [{ name: meta.name, url: meta.siteUrl }],
  creator: meta.name,
  publisher: meta.name,
  alternates: {
    canonical: meta.siteUrl,
  },
  category: "technology",
  openGraph: {
    type: "profile",
    firstName: "Gunratna",
    lastName: "Borkar",
    title: `${meta.name} — AI Engineer | IIT Bombay`,
    description: meta.tagline,
    url: meta.siteUrl,
    siteName: `${meta.name} — AI Engineer Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${meta.name} — AI Engineer | IIT Bombay`,
    description: meta.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  ...(meta.googleVerification
    ? { verification: { google: meta.googleVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#15130f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: meta.name,
  givenName: "Gunratna",
  familyName: "Borkar",
  jobTitle: "Senior AI Engineer",
  description: meta.tagline,
  worksFor: {
    "@type": "Organization",
    name: "CAMS",
    description: "Computer Age Management Services — India's largest mutual fund registrar and transfer agent",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Technology, Bombay",
    sameAs: "https://www.iitb.ac.in/",
  },
  email: meta.email,
  url: meta.siteUrl,
  image: `${meta.siteUrl}/opengraph-image`,
  sameAs: [meta.linkedin, meta.github],
  knowsAbout: [
    "Artificial Intelligence",
    "Agentic AI Systems",
    "Large Language Models",
    "LLM Fine-tuning",
    "Vision-Language Models",
    "Retrieval-Augmented Generation",
    "Machine Learning",
    "MLOps",
    "Computer Vision",
    "Document Intelligence",
    "PyTorch",
    "LangGraph",
    "Google Cloud Platform",
  ],
  knowsLanguage: ["English", "Hindi"],
  nationality: { "@type": "Country", name: "India" },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${meta.name} — AI Engineer Portfolio`,
  url: meta.siteUrl,
  author: { "@type": "Person", name: meta.name },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrains.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('gb-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body>
        <QualityProvider>{children}</QualityProvider>
        <Analytics />
      </body>
    </html>
  );
}
