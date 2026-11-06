// Single source of truth for every price on the site.
//
// Prices used to live inline in six different components and drifted apart.
// Anything that shows a number — the homepage teaser, the Services page,
// the FAQ — reads from here instead. Change a price once, in this file.
//
// Model: two tiers, $0 down, 12-month term. Branding and identity services
// are intentionally not offered and are absent from this file by design.

export interface PlanFeature {
  label: string;
  detail: string;
}

export interface Plan {
  id: "essentials" | "professional";
  name: string;
  price: number;
  cadence: string;
  terms: string;
  /** Who this tier is for. Used as the card subhead. */
  audience: string;
  /** Short line under the price on the homepage teaser. */
  tagline: string;
  /** The bullets shown on the homepage card. Keep both plans to the same count. */
  highlights: string[];
  /** The full included-features table on the Services page. */
  features: PlanFeature[];
  /** Honest scope boundary. Essentials only. */
  excluded?: string;
}

export const plans: Plan[] = [
  {
    id: "essentials",
    name: "Essentials",
    price: 149,
    cadence: "/ month",
    terms: "$0 down · 12-month term",
    audience:
      "Trades, local service businesses, and single-location shops whose customers find them through Google Maps and referrals.",
    tagline: "Everything a local business needs to show up and get called.",
    highlights: [
      "Up to 5 custom pages, hand-coded",
      "I write your content, you don't have to",
      "Hosting, SSL, backups and monitoring handled",
      "Unlimited content updates",
      "Google Business Profile setup and on-page SEO",
      "Direct text and email support, 1 business day",
    ],
    features: [
      {
        label: "Pages",
        detail:
          "Up to 5 custom pages, plus the privacy policy, terms and accessibility pages every site needs. Eight in total.",
      },
      { label: "Design", detail: "Custom, hand-coded, built from a discovery call" },
      {
        label: "Content writing",
        detail:
          "I write your page copy from the discovery call. You never have to hand over finished text.",
      },
      { label: "Development", detail: "Astro, deployed on Netlify" },
      { label: "Hosting", detail: "Included, on your own account" },
      { label: "SSL and security", detail: "Included" },
      { label: "Mobile optimization", detail: "Included" },
      { label: "Performance", detail: "90+ Lighthouse target" },
      { label: "Content edits", detail: "Unlimited" },
      { label: "Accessibility", detail: "WCAG 2.1 AA baseline" },
      { label: "On-page SEO", detail: "Metadata, schema, internal linking, sitemap" },
      { label: "Contact forms", detail: "Up to 2" },
      { label: "Google Business Profile", detail: "Initial setup and optimization" },
      { label: "Analytics", detail: "GA4 and Search Console configured" },
      { label: "Support", detail: "Direct text and email, 1 business day response" },
      { label: "Uptime monitoring", detail: "Included" },
      { label: "Backups", detail: "Included" },
    ],
    excluded:
      "Ongoing SEO work, blog, e-commerce, custom integrations, and additional locations are add-ons rather than part of this plan.",
  },
  {
    id: "professional",
    name: "Professional",
    price: 299,
    cadence: "/ month",
    terms: "$0 down · 12-month term",
    audience:
      "Attorneys, clinics, funeral homes, campgrounds, private schools, and multi-service or multi-location businesses. Anyone who competes in search.",
    tagline: "Everything in Essentials, plus the content engine that wins search.",
    highlights: [
      "Up to 25 custom pages, hand-coded",
      "Deeper content research and revision on every page",
      "A dedicated page for every service and location",
      "Blog and CMS setup with unlimited publishing",
      "Quarterly reporting on indexing, rankings and speed",
      "Priority same-business-day support",
    ],
    features: [
      { label: "Pages", detail: "Up to 25" },
      {
        label: "Page rollout",
        detail:
          "Your site launches with 5 to 8 pages, then grows by 2 to 3 more each month until you reach your full page count.",
      },
      { label: "Location pages", detail: "Up to 5, substantively distinct" },
      { label: "Service pages", detail: "An individual page for every service" },
      { label: "Blog / CMS", detail: "Setup and unlimited publishing" },
      {
        label: "Advanced schema",
        detail: "LocalBusiness, Service, FAQ, Article, and industry-specific",
      },
      { label: "Contact forms", detail: "Up to 5, including multi-step" },
      { label: "Reporting", detail: "Quarterly: indexing, rankings, Core Web Vitals" },
      {
        label: "Content production",
        detail:
          "The same writing as Essentials, taken further: real research per page, more revision passes, and copy aimed at the services and locations you want to rank for.",
      },
      { label: "Support", detail: "Priority, same business day" },
      { label: "Strategy", detail: "Annual review call" },
    ],
  },
];

// Why the rollout is staged rather than launching all 25 at once: a young domain
// rations how much it will crawl, so 25 pages dumped on day one mostly sit
// unindexed. Shipping 5 to 8 first, then adding 2 to 3 a month, gets each page
// actually indexed and gives Google a reason to keep coming back. It is the
// better SEO strategy, and it is worth selling as one on the Services page.

export const essentials = plans[0];
export const professional = plans[1];

/** Shown wherever both prices are summarized as a range. */
export const priceRange = `$${essentials.price} to $${professional.price}`;

// ---------------------------------------------------------------------------
// ADD-ONS
// ---------------------------------------------------------------------------

export interface AddOn {
  name: string;
  price: string;
  note: string;
}

export interface AddOnGroup {
  id: string;
  title: string;
  intro: string;
  items: AddOn[];
  /** Optional closing line that explains the group's pricing logic. */
  footnote?: string;
}

export const addOnGroups: AddOnGroup[] = [
  {
    id: "pages",
    title: "Pages and content",
    intro: "Grow the site past your plan's page count whenever you are ready.",
    items: [
      {
        name: "Additional page",
        price: "$15 / mo per page",
        note: "Beyond your plan's page count. Billed when the page goes live, not when it is requested.",
      },
      {
        name: "Blog setup",
        price: "$39 / mo",
        note: "Full CMS on the back end so you can publish on your own. Already included in Professional.",
      },
      {
        name: "Written blog post",
        price: "$150 each, or $400 / mo for three",
        note: "I research and write it. Posts never count against your page count.",
      },
      {
        name: "Additional location page",
        price: "$25 / mo",
        note: "More than a standard page because it takes real local research to rank.",
      },
    ],
  },
  {
    id: "local-seo",
    title: "Local SEO",
    intro:
      "On-page SEO is part of every plan. The ongoing off-site work — your Google Business Profile, citations, reviews — is what these cover.",
    items: [
      {
        name: "Local SEO Management",
        price: "$349 / mo",
        note: "Four GBP posts a month, photo uploads and Q&A, citation audit and NAP cleanup across 40+ directories, a review request system with monitoring, competitor rank tracking on 20 keywords, a monthly report with recommendations, and a quarterly strategy call.",
      },
      {
        name: "Local SEO Lite",
        price: "$199 / mo",
        note: "Google Business Profile management, review monitoring, 10-keyword rank tracking, and a monthly report.",
      },
      {
        name: "Local SEO Audit",
        price: "$497 one-time",
        note: "A full technical, GBP, citation and competitor analysis with a prioritized roadmap. Yours to keep, whether or not we work together after.",
      },
    ],
    footnote:
      "The line is simple: onsite SEO is in your plan because it is part of building the site correctly. Offsite SEO is ongoing labor that never stops, so it is priced separately.",
  },
  {
    id: "technical",
    title: "Technical and integrations",
    intro:
      "Real engineering rather than web design, so these are the one place a genuine upfront cost applies. The monthly covers monitoring, because integrations break and that is on me.",
    items: [
      {
        name: "Simple integration",
        price: "$300 one-time + $25 / mo",
        note: "A booking embed, live chat, or a CRM form wired into your site.",
      },
      {
        name: "Custom API integration",
        price: "$1,500 to $4,000 + $49 / mo",
        note: "Connecting your site to software you already run. Scoped and quoted before anything starts.",
      },
      {
        name: "Advanced forms",
        price: "$400 one-time",
        note: "Multi-step, conditional logic, or file uploads. No monthly cost.",
      },
      {
        name: "Payment or booking system",
        price: "$800 to $2,000 + $39 / mo",
        note: "Take payments or let customers book directly on your site.",
      },
      {
        name: "Membership or gated content",
        price: "Quoted",
        note: "Logins, member areas, and content behind a wall. Scoped case by case.",
      },
      {
        name: "Additional language",
        price: "Included in the build + $99 / mo",
        note: "A second full language version of your site, maintained alongside the first.",
      },
    ],
  },
  {
    id: "scope",
    title: "Rush and scope",
    intro: "For projects that are bigger or faster than the standard build.",
    items: [
      {
        name: "Rush delivery",
        price: "+$750 one-time",
        note: "A two-week launch instead of the standard 30 days.",
      },
      {
        name: "Large site build",
        price: "$1,500 to $3,500 one-time",
        note: "For sites of 40+ pages, on top of the monthly plan.",
      },
      {
        name: "Migration",
        price: "$800 to $1,500 one-time",
        note: "Moving an existing site of 100+ URLs with full redirect mapping so you keep your rankings.",
      },
      {
        name: "Additional business location",
        price: "$79 / mo",
        note: "A second or third physical location, each with its own local presence.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// COMPARISON
// ---------------------------------------------------------------------------

export interface ComparisonRow {
  label: string;
  diy: string;
  freelancer: string;
  agency: string;
  bb: string;
}

export const comparisonColumns = ["DIY / AI", "Freelancer", "Agency", "Beyond Belief"];

export const comparisonRows: ComparisonRow[] = [
  {
    label: "Upfront cost",
    diy: "$0",
    freelancer: "$1,500 to $4,000",
    agency: "$8,000 to $25,000",
    bb: "$0",
  },
  {
    label: "Monthly",
    diy: "$20 to $50",
    freelancer: "Nothing after launch",
    agency: "$200 to $1,000",
    bb: "$149 to $299",
  },
  {
    label: "Year one total",
    diy: "~$400",
    freelancer: "~$3,000",
    agency: "~$14,000",
    bb: "$1,788 to $3,588",
  },
  { label: "Custom design", diy: "No", freelancer: "Sometimes", agency: "Yes", bb: "Yes" },
  { label: "Hand-coded", diy: "No", freelancer: "Rarely", agency: "Sometimes", bb: "Always" },
  {
    label: "Ongoing edits",
    diy: "You do it",
    freelancer: "Hourly",
    agency: "Hourly or retainer",
    bb: "Unlimited",
  },
  {
    label: "Response time",
    diy: "None",
    freelancer: "Days to never",
    agency: "3 to 5 days",
    bb: "Same day",
  },
  {
    label: "You own your assets",
    diy: "Platform-locked",
    freelancer: "Varies",
    agency: "Often not",
    bb: "Always",
  },
  { label: "Competitor exclusivity", diy: "No", freelancer: "No", agency: "No", bb: "Yes" },
  {
    label: "Your site after month six",
    diy: "Stale",
    freelancer: "Abandoned",
    agency: "Ticket queue",
    bb: "Still improving",
  },
];
