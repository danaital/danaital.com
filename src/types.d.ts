/* =============================================================================
   Shared content types for the site. This is a declaration file — `tsc` type-
   checks it but emits no JS, so it costs nothing at runtime and both data.ts
   and main.ts compile against the same shape.
   ========================================================================== */

/** Contact form + phone-notification configuration. */
interface SiteConfig {
  /** Web3Forms access key; while unset (or "YOUR_…") the form falls back to mailto. */
  web3formsKey: string;
  /** ntfy.sh topic for phone push on each inquiry; unset (or "YOUR_…") disables it. */
  ntfyTopic: string;
  /** Address used by the mailto fallback. */
  contactEmail: string;
}

/** A linked repository shown as a chip on a project card. */
interface ProjectRepo {
  label: string;
  /** Empty string renders a non-clickable "Private" chip. */
  url: string;
}

interface Project {
  name: string;
  blurb: string;
  stack: string[];
  /** Optional small label rendered next to the title. */
  tag?: string;
  /** CSS class for the tag pill (e.g. "tag-accent"). */
  tagClass?: string;
  /** Primary "View project / View on GitHub" link; empty = private repository. */
  link?: string;
  /** Live-demo URL; the button only appears once set. */
  demo?: string;
  /** Render an "Inquire about this" link that prefills the contact form. */
  inquire?: boolean;
  /** Opt in to rendering the `repos` chip list on this card. */
  showRepos?: boolean;
  repos?: ProjectRepo[];
}

/** A LinkedIn / writing post. */
interface Post {
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date?: string;
  excerpt?: string;
  link?: string;
}

interface ContactLink {
  label: string;
  value: string;
  href: string;
}

interface ExperienceItem {
  role: string;
  org?: string;
  period?: string;
  meta?: string;
  points?: string[];
}

interface EducationItem {
  degree: string;
  org?: string;
  period?: string;
  note?: string;
}

interface Certificate {
  name: string;
  issuer?: string;
  year?: string;
}

/** The full content payload assigned to `window.SITE_DATA` by data.ts. */
interface SiteData {
  config: SiteConfig;
  skills: string[];
  projects: Project[];
  linkedinUrl?: string;
  posts: Post[];
  contacts: ContactLink[];
  experience: {
    development: ExperienceItem[];
    teaching: ExperienceItem[];
  };
  education: EducationItem[];
  certificates: Certificate[];
}

interface Window {
  SITE_DATA?: SiteData;
  /** Exposed by main.ts so inline handlers / the console can raise a toast. */
  showToast?: (message: string, ms?: number) => void;
}
