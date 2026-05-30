/* =============================================================================
   Site content — edit this file to update the website. No build step needed.
   ========================================================================== */

window.SITE_DATA = {
  /* Core technologies shown in the strip under the hero. */
  skills: [
    "TypeScript", "React", "React Native", "Node.js", "NestJS",
    "FastAPI", "Python", "Prisma", "PostgreSQL", "Redis", "C++",
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
    },
    {
      name: "Phonics",
      tag: "Reichman miLAB · hardware",
      blurb:
        "An interactive tabletop device that helps children learn to read by building words from physical, RFID-tagged letter tokens. A Raspberry Pi reads the tokens (MFRC522 RFID), gives real-time feedback through NeoPixel LEDs, physical buttons and audio, and is driven by a Flask + SQLite backend. Designed, built and user-tested at Reichman University's (IDC) miLAB; the v2 reworked it into a clean Raspberry-Pi API with a persistence layer.",
      stack: ["Python", "Raspberry Pi", "RFID", "Flask", "SQLite", "NeoPixel"],
      link: "http://milab.idc.ac.il/teaching/projects/phonics/",
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
    },
    {
      name: "Expense Tracker",
      tag: "Full-stack web app",
      blurb:
        "A full-stack expense-tracking app — React front end, NestJS back end and Redis for fast, server-backed state.",
      stack: ["React", "NestJS", "Redis"],
      link: "https://github.com/danaital/expenses-frontend",
    },
    {
      name: "Reports System",
      tag: "Ofran · internal tool",
      blurb:
        "An internal desktop tool built for Ofran Worldwide Car Rental that ingests supplier rate spreadsheets (e.g. Europcar one-way rates across Japan) and turns raw Excel data into clean, structured reports. Python with an object-oriented core and a GUI so non-technical staff can run it directly.",
      stack: ["Python", "GUI", "Excel data"],
      link: "https://github.com/danaital/Ofran_project",
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
