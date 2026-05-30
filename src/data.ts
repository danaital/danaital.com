/* =============================================================================
   Site content — edit this file, then `npm run build` to compile to assets/.
   ========================================================================== */

(window as any).SITE_DATA = {
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
      name: "Reports System",
      tag: "Flagship · Ofran platform",
      tagClass: "tag-accent",
      blurb:
        "A production React + TypeScript frontend for Ofran Worldwide Car Rental's internal reports platform. Built with Vite and styled-components, with full English/Hebrew (RTL) support, responsive layouts, and a typed, well-tested architecture (Vitest, Playwright, Nx). The repos here use synthetic sample data — no real client or rate data.",
      stack: ["React", "TypeScript", "Vite", "styled-components", "i18n / RTL"],
      link: "",
      demo: "", // TODO: live demo URL — button appears once set
      inquire: true,
      repos: [
        { label: "Frontend · React + Vite", url: "https://github.com/danaital/reports-frontend" },
        { label: "Backend · NestJS", url: "https://github.com/danaital/reports-backend" },
        { label: "AI Ops · report generator", url: "https://github.com/danaital/reports-ai-ops" },
      ],
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
      link: "",
      demo: "", // TODO: live demo URL — button appears once set
      showRepos: true,
      repos: [
        { label: "Frontend · React", url: "https://github.com/danaital/course-management-frontend" },
        { label: "Backend · NestJS", url: "https://github.com/danaital/course-management-backend" },
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
      name: "This Website",
      tag: "TypeScript · open source",
      blurb:
        "The site you're looking at — a TypeScript codebase compiled to static HTML/CSS/JS with no framework. Data-driven project/experience cards, timed toast notifications, a working contact form (Web3Forms + ntfy phone push), and a daily GitHub Actions job that surfaces new repos and audits repository privacy. Built and shipped to GitHub Pages through a CI pipeline.",
      stack: ["TypeScript", "HTML", "CSS", "GitHub Actions", "GitHub Pages"],
      link: "https://github.com/danaital/danaital.com",
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

  /* -------------------------------------------------------------------------
     Experience — from LinkedIn, split into Development and Teaching.
     ---------------------------------------------------------------------- */
  experience: {
    development: [
      {
        role: "Software Developer",
        org: "Ofran Worldwide Car Rental",
        period: "Jan 2025 – Present",
        meta: "Full-time · On-site · Bnei Brak, Israel",
        points: [
          "Building the company's internal Reports platform end-to-end — React + TypeScript (Vite) frontend and NestJS backend, with full English/Hebrew (RTL) support.",
          "Built an AI-driven report-generation tool that replaced a 253-file database-migration chain.",
        ],
      },
      {
        role: "Full-Stack Developer",
        org: "Ryde — Outsmart Mobility",
        period: "Jul 2023 – Jan 2025",
        meta: "Full-time · Hybrid · Rishon LeZion, Israel",
        points: [
          "Full-stack development at a mobility company across a broad web stack — Node.js, SQL, and more.",
        ],
      },
      {
        role: "Software Development Intern",
        org: "eToro",
        period: "Nov 2021 – Sep 2022",
        meta: "Part-time · Bnei Brak, Israel",
        points: [
          "Software development internship — backend work with SQL and C#.",
        ],
      },
      {
        role: "IT Analyst",
        org: "Ofran Services Ltd.",
        period: "Aug 2019 – Feb 2020",
        meta: "Full-time",
        points: [
          "Analysed work processes and fine-tuned the company's system.",
        ],
      },
    ],
    teaching: [
      {
        role: "Recitation Instructor — Introduction to Computer Science",
        org: "Reichman University (IDC Herzliya)",
        period: "Oct 2022 – Present",
        meta: "Part-time",
        points: [
          "Teach first-year students the fundamentals of programming and computer science in Java.",
          "Lead weekly recitations, write practice material, and support students through the course.",
        ],
      },
      {
        role: "Teaching Assistant",
        org: "Google × Reichman Tech School",
        period: "Oct 2022 – Apr 2023",
        meta: "Part-time · Hybrid · Tel Aviv, Israel",
        points: [
          "TA for a Google × Reichman Tech School program — Python, Node.js, and web development.",
        ],
      },
      {
        role: "Teaching Assistant — Introduction to Computer Science",
        org: "Reichman University (IDC Herzliya) · RRIS",
        period: "Oct 2020 – Feb 2021",
        meta: "Part-time",
        points: [
          "TA for Intro to Computer Science at the Raphael Recanati International School (RRIS).",
        ],
      },
    ],
  },

  /* Education. Verify degrees/dates. */
  education: [
    {
      degree: "M.Sc., Machine Learning & Data Science",
      org: "Reichman University (IDC Herzliya)",
      period: "Sep 2025 – Present",
      note: "",
    },
    {
      degree: "B.Sc., Computer Science",
      org: "Reichman University (IDC Herzliya)",
      period: "2018 – 2023",
      note: "",
    },
  ],

  /* Certificates — add items as { name, issuer, year }. Section hides while empty. */
  certificates: [
    // { name: "Example Certificate", issuer: "Issuer", year: "2025" },
  ],
};
