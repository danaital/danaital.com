/* =============================================================================
   Site content — edit this file to update the website. No build step needed.
   ========================================================================== */

window.SITE_DATA = {
  /* -------------------------------------------------------------------------
     Contact form + phone-notification config.
     1. web3formsKey: get a FREE key at https://web3forms.com (no account —
        just enter taldanai@icloud.com and it emails you an access key).
        Until this is set, the form falls back to opening the visitor's email.
     2. ntfyTopic: pick a private, hard-to-guess topic name, then subscribe to
        it in the ntfy app (App Store / Google Play / https://ntfy.sh).
        On every inquiry the site pushes a notification to that topic.
        (Also set the same value as the repo `NTFY_TOPIC` Actions secret so the
        daily GitHub scan can notify you too.)
     ---------------------------------------------------------------------- */
  config: {
    web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY",
    ntfyTopic: "YOUR_NTFY_TOPIC",
    contactEmail: "taldanai@icloud.com",
  },

  /* Core technologies shown in the strip under the hero. */
  skills: [
    "TypeScript", "React", "React Native", "Node.js", "NestJS",
    "FastAPI", "Python", "Java", "Prisma", "PostgreSQL", "Redis", "C++",
  ],

  /* -------------------------------------------------------------------------
     Projects. `link` is optional — omit it (or set to "") for private repos
     and the card renders without a dead link. `tag` shows a small label.
     ---------------------------------------------------------------------- */
  projects: [
    {
      name: "StudyMate",
      tag: "Flagship · AI study platform",
      blurb:
        "An AI-powered study platform built as five independent services: a React + Vite web app, a React Native (Expo) mobile app, a NestJS + Prisma + Postgres core backend, a FastAPI + Pydantic ML backend, and a shared design-system UI kit. The ML service handles Whisper transcription, question generation, an SSE AI tutor, a math grader and a sandboxed code runner. Ships voice tutoring, spaced-repetition flashcards, inline-graded practice questions, and full English/Hebrew (RTL) parity — built to pass App Store and Play review.",
      stack: ["React", "React Native", "Expo", "NestJS", "Prisma", "Postgres", "FastAPI", "Python", "Whisper"],
      link: "",
      tagClass: "tag-accent",
      demo: "", // TODO: live demo URL — button appears once set
      inquire: true,
      repos: [
        { label: "Web · React + Vite", url: "" },
        { label: "Mobile · React Native + Expo", url: "" },
        { label: "Core API · NestJS + Prisma", url: "" },
        { label: "ML API · FastAPI", url: "" },
        { label: "UI Kit · design system", url: "" },
      ],
    },
    {
      name: "Phonics",
      tag: "Reichman miLAB · hardware",
      blurb:
        "An interactive tabletop device that helps children learn to read by building words from physical, RFID-tagged letter tokens. A Raspberry Pi reads the tokens (MFRC522 RFID), gives real-time feedback through NeoPixel LEDs, physical buttons and audio, and is driven by a Flask + SQLite backend. Designed, built and user-tested at Reichman University's (IDC) miLAB; the v2 reworked it into a clean Raspberry-Pi API with a persistence layer.",
      stack: ["Python", "Raspberry Pi", "RFID", "Flask", "SQLite", "NeoPixel"],
      link: "http://milab.idc.ac.il/teaching/projects/phonics/",
      inquire: true,
    },
    {
      name: "Beacon of Light",
      tag: "AI fact-checking platform",
      blurb:
        "An AI-powered fact-checking platform. Submit an article by URL or pasted text and it scores accuracy, neutrality, source quality and context, assigns each key claim a verdict with sources, and generates cited corrections plus a clean corrected version — then lets you discuss the result with a neutral assistant. Self-contained and local-first: Next.js (App Router), a file-based SQLite store, and any OpenAI-compatible local LLM, with a deterministic offline mock.",
      stack: ["Next.js", "TypeScript", "styled-components", "SQLite", "Local LLM"],
      link: "",
      inquire: true,
    },
    {
      name: "Reports System",
      tag: "Ofran · internal platform",
      blurb:
        "A production React + TypeScript frontend for Ofran Worldwide Car Rental's internal reports platform. Built with Vite and styled-components, with full English/Hebrew (RTL) support, responsive layouts, and a typed, well-tested architecture (Vitest, Playwright, Nx). The repos here use synthetic sample data — no real client or rate data.",
      stack: ["React", "TypeScript", "Vite", "styled-components", "i18n / RTL"],
      link: "https://github.com/danaital/reports-frontend",
      demo: "", // TODO: live demo URL — button appears once set
      repos: [
        { label: "Frontend · React + Vite", url: "https://github.com/danaital/reports-frontend" },
        { label: "Backend · NestJS", url: "https://github.com/danaital/reports-backend" },
      ],
    },
    {
      name: "Zoom Virtual Assistant",
      tag: "IoT final project",
      blurb:
        "An embedded virtual assistant integrating with Zoom, written in C++ — the capstone of an IoT course. Bridges hardware sensing with a real-time meeting workflow.",
      stack: ["C++", "IoT", "Embedded"],
      link: "https://github.com/danaital/ZoomVirtualAssistant",
    },
    {
      name: "Course Management",
      tag: "Full-stack web app",
      blurb:
        "A course-management system with a React front end and a NestJS back end — handling courses, enrolment and administration end to end.",
      stack: ["React", "TypeScript", "NestJS"],
      link: "https://github.com/danaital/course-management-frontend",
      demo: "", // TODO: live demo URL — button appears once set
      repos: [
        { label: "Frontend · React", url: "https://github.com/danaital/course-management-frontend" },
        { label: "Backend · NestJS", url: "https://github.com/danaital/course-management-backend" },
      ],
    },
  ],

  /* -------------------------------------------------------------------------
     Writing / LinkedIn posts.
     Each item: { title, date, excerpt, link }.
     Drop your LinkedIn posts here (or ask Claude to pull them via the Chrome
     extension). While empty, a friendly call-to-action is shown instead.
     ---------------------------------------------------------------------- */
  linkedinUrl: "https://www.linkedin.com/in/tal-danai/", // TODO: confirm your exact LinkedIn URL
  posts: [
    // {
    //   title: "Shipping a 5-service study platform solo",
    //   date: "2026-05-01",
    //   excerpt: "What I learned splitting StudyMate into independent repos…",
    //   link: "https://www.linkedin.com/posts/…",
    // },
  ],

  /* Contact / social links. */
  contacts: [
    { label: "Email", value: "taldanai@icloud.com", href: "mailto:taldanai@icloud.com" },
    { label: "GitHub", value: "github.com/danaital", href: "https://github.com/danaital" },
    { label: "LinkedIn", value: "Tal Danai", href: "https://www.linkedin.com/in/tal-danai/" },
  ],
};
