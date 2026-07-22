export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

// The real navigation. "Get started" is a primary CTA handled separately by
// Nav.astro (not a nav item), so it is intentionally left out of this list.
// Phase 1: single landing page — nav items anchor to home-page sections.
// When the dedicated pages go live, swap these back to /work, /web-design, /about.
export const navData: NavItem[] = [
  { title: "Work", href: "/#work" },
  { title: "Web Design", href: "/#services" },
  { title: "About", href: "/#about" },
  { title: "Contact", href: "/#contact" },
];
