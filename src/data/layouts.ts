export interface LayoutPosition {
  role: "title" | "subtitle" | "body" | "image" | "chart" | "accent";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutPreset {
  id: string;
  name: string;
  category: "universal" | "marketing" | "business" | "developer" | "creative" | "education";
  positions: LayoutPosition[];
}

export const layoutPresets: LayoutPreset[] = [
  // === Universal ===
  { id: "title-centered", name: "Title Centered", category: "universal", positions: [
    { role: "title", x: 80, y: 200, width: 800, height: 80 },
    { role: "subtitle", x: 180, y: 300, width: 600, height: 50 },
  ]},
  { id: "title-left", name: "Title Left", category: "universal", positions: [
    { role: "title", x: 80, y: 60, width: 500, height: 80 },
    { role: "body", x: 80, y: 160, width: 800, height: 320 },
  ]},
  { id: "two-column", name: "Two Column", category: "universal", positions: [
    { role: "title", x: 80, y: 40, width: 800, height: 60 },
    { role: "body", x: 80, y: 120, width: 380, height: 360 },
    { role: "body", x: 500, y: 120, width: 380, height: 360 },
  ]},
  { id: "three-column", name: "Three Column", category: "universal", positions: [
    { role: "title", x: 80, y: 40, width: 800, height: 60 },
    { role: "body", x: 40, y: 120, width: 270, height: 360 },
    { role: "body", x: 345, y: 120, width: 270, height: 360 },
    { role: "body", x: 650, y: 120, width: 270, height: 360 },
  ]},
  { id: "content", name: "Content", category: "universal", positions: [
    { role: "title", x: 80, y: 40, width: 800, height: 60 },
    { role: "body", x: 80, y: 120, width: 800, height: 380 },
  ]},
  { id: "blank", name: "Blank", category: "universal", positions: [] },
  { id: "section-break", name: "Section Break", category: "universal", positions: [
    { role: "title", x: 80, y: 220, width: 800, height: 80 },
  ]},

  // === Marketing ===
  { id: "hero-banner", name: "Hero Banner", category: "marketing", positions: [
    { role: "image", x: 0, y: 0, width: 960, height: 540 },
    { role: "title", x: 80, y: 180, width: 500, height: 80 },
    { role: "subtitle", x: 80, y: 280, width: 400, height: 50 },
  ]},
  { id: "feature-highlight", name: "Feature Highlight", category: "marketing", positions: [
    { role: "title", x: 80, y: 40, width: 400, height: 60 },
    { role: "body", x: 80, y: 120, width: 380, height: 300 },
    { role: "image", x: 500, y: 80, width: 400, height: 380 },
  ]},
  { id: "comparison", name: "Comparison", category: "marketing", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 60, y: 100, width: 400, height: 400 },
    { role: "body", x: 500, y: 100, width: 400, height: 400 },
  ]},
  { id: "pricing", name: "Pricing", category: "marketing", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 40, y: 100, width: 280, height: 400 },
    { role: "body", x: 340, y: 100, width: 280, height: 400 },
    { role: "body", x: 640, y: 100, width: 280, height: 400 },
  ]},
  { id: "testimonial", name: "Testimonial", category: "marketing", positions: [
    { role: "accent", x: 80, y: 80, width: 80, height: 80 },
    { role: "body", x: 80, y: 180, width: 600, height: 200 },
    { role: "subtitle", x: 80, y: 400, width: 300, height: 40 },
  ]},
  { id: "call-to-action", name: "Call to Action", category: "marketing", positions: [
    { role: "title", x: 160, y: 140, width: 640, height: 80 },
    { role: "subtitle", x: 230, y: 240, width: 500, height: 50 },
    { role: "accent", x: 370, y: 340, width: 220, height: 60 },
  ]},
  { id: "social-proof", name: "Social Proof", category: "marketing", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 40, y: 100, width: 200, height: 200 },
    { role: "body", x: 280, y: 100, width: 200, height: 200 },
    { role: "body", x: 520, y: 100, width: 200, height: 200 },
    { role: "body", x: 760, y: 100, width: 160, height: 200 },
  ]},
  { id: "before-after", name: "Before & After", category: "marketing", positions: [
    { role: "title", x: 200, y: 20, width: 560, height: 50 },
    { role: "image", x: 40, y: 90, width: 420, height: 400 },
    { role: "image", x: 500, y: 90, width: 420, height: 400 },
  ]},

  // === Business ===
  { id: "agenda", name: "Agenda", category: "business", positions: [
    { role: "title", x: 80, y: 40, width: 400, height: 60 },
    { role: "body", x: 80, y: 120, width: 800, height: 380 },
  ]},
  { id: "timeline", name: "Timeline", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 40, y: 100, width: 880, height: 400 },
  ]},
  { id: "stats", name: "Stats / Metrics", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 40, y: 100, width: 200, height: 200 },
    { role: "body", x: 280, y: 100, width: 200, height: 200 },
    { role: "body", x: 520, y: 100, width: 200, height: 200 },
    { role: "body", x: 760, y: 100, width: 160, height: 200 },
  ]},
  { id: "team", name: "Team", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "image", x: 80, y: 120, width: 180, height: 180 },
    { role: "image", x: 300, y: 120, width: 180, height: 180 },
    { role: "image", x: 520, y: 120, width: 180, height: 180 },
    { role: "image", x: 740, y: 120, width: 180, height: 180 },
  ]},
  { id: "roadmap", name: "Roadmap", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 40, y: 100, width: 880, height: 400 },
  ]},
  { id: "swot", name: "SWOT Analysis", category: "business", positions: [
    { role: "title", x: 300, y: 20, width: 360, height: 40 },
    { role: "body", x: 40, y: 80, width: 430, height: 210 },
    { role: "body", x: 490, y: 80, width: 430, height: 210 },
    { role: "body", x: 40, y: 310, width: 430, height: 210 },
    { role: "body", x: 490, y: 310, width: 430, height: 210 },
  ]},
  { id: "financial-summary", name: "Financial Summary", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "chart", x: 80, y: 100, width: 500, height: 380 },
    { role: "body", x: 620, y: 100, width: 280, height: 380 },
  ]},
  { id: "milestone", name: "Milestone", category: "business", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "accent", x: 80, y: 100, width: 100, height: 100 },
    { role: "body", x: 200, y: 100, width: 680, height: 380 },
  ]},

  // === Developer ===
  { id: "code-snippet", name: "Code Snippet", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 60, y: 100, width: 840, height: 400 },
  ]},
  { id: "architecture", name: "Architecture Diagram", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "image", x: 80, y: 100, width: 800, height: 400 },
  ]},
  { id: "api-overview", name: "API Overview", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 400, height: 50 },
    { role: "body", x: 80, y: 100, width: 380, height: 400 },
    { role: "body", x: 500, y: 100, width: 400, height: 400 },
  ]},
  { id: "tech-stack", name: "Tech Stack", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 80, y: 100, width: 800, height: 380 },
  ]},
  { id: "demo-screenshot", name: "Demo Screenshot", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 500, height: 50 },
    { role: "image", x: 60, y: 90, width: 840, height: 420 },
  ]},
  { id: "performance-benchmark", name: "Performance Benchmark", category: "developer", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "chart", x: 80, y: 100, width: 800, height: 400 },
  ]},

  // === Creative ===
  { id: "full-image", name: "Full Image", category: "creative", positions: [
    { role: "image", x: 0, y: 0, width: 960, height: 540 },
  ]},
  { id: "quote", name: "Quote", category: "creative", positions: [
    { role: "body", x: 120, y: 150, width: 720, height: 200 },
    { role: "subtitle", x: 300, y: 380, width: 360, height: 40 },
  ]},
  { id: "big-number", name: "Big Number", category: "creative", positions: [
    { role: "title", x: 80, y: 120, width: 800, height: 150 },
    { role: "subtitle", x: 200, y: 300, width: 560, height: 60 },
  ]},
  { id: "split-screen", name: "Split Screen", category: "creative", positions: [
    { role: "image", x: 0, y: 0, width: 480, height: 540 },
    { role: "title", x: 520, y: 150, width: 400, height: 80 },
    { role: "body", x: 520, y: 250, width: 400, height: 200 },
  ]},
  { id: "portfolio-grid", name: "Portfolio Grid", category: "creative", positions: [
    { role: "title", x: 80, y: 20, width: 800, height: 40 },
    { role: "image", x: 40, y: 80, width: 280, height: 200 },
    { role: "image", x: 340, y: 80, width: 280, height: 200 },
    { role: "image", x: 640, y: 80, width: 280, height: 200 },
    { role: "image", x: 40, y: 300, width: 280, height: 200 },
    { role: "image", x: 340, y: 300, width: 280, height: 200 },
    { role: "image", x: 640, y: 300, width: 280, height: 200 },
  ]},
  { id: "mood-board", name: "Mood Board", category: "creative", positions: [
    { role: "image", x: 20, y: 20, width: 460, height: 330 },
    { role: "image", x: 500, y: 20, width: 440, height: 160 },
    { role: "image", x: 500, y: 200, width: 220, height: 320 },
    { role: "image", x: 740, y: 200, width: 200, height: 320 },
    { role: "body", x: 20, y: 370, width: 460, height: 150 },
  ]},

  // === Education ===
  { id: "step-by-step", name: "Step by Step", category: "education", positions: [
    { role: "title", x: 80, y: 30, width: 800, height: 50 },
    { role: "body", x: 80, y: 100, width: 250, height: 380 },
    { role: "body", x: 355, y: 100, width: 250, height: 380 },
    { role: "body", x: 630, y: 100, width: 250, height: 380 },
  ]},
  { id: "definition", name: "Definition", category: "education", positions: [
    { role: "title", x: 80, y: 100, width: 800, height: 80 },
    { role: "body", x: 120, y: 220, width: 720, height: 250 },
  ]},
  { id: "pros-cons", name: "Pros & Cons", category: "education", positions: [
    { role: "title", x: 200, y: 30, width: 560, height: 50 },
    { role: "body", x: 40, y: 100, width: 430, height: 400 },
    { role: "body", x: 490, y: 100, width: 430, height: 400 },
  ]},
  { id: "quiz", name: "Quiz", category: "education", positions: [
    { role: "title", x: 80, y: 40, width: 800, height: 80 },
    { role: "body", x: 80, y: 160, width: 380, height: 160 },
    { role: "body", x: 500, y: 160, width: 380, height: 160 },
    { role: "body", x: 80, y: 350, width: 380, height: 160 },
    { role: "body", x: 500, y: 350, width: 380, height: 160 },
  ]},
  { id: "diagram-label", name: "Diagram with Labels", category: "education", positions: [
    { role: "title", x: 80, y: 20, width: 800, height: 50 },
    { role: "image", x: 180, y: 80, width: 600, height: 350 },
    { role: "body", x: 80, y: 450, width: 800, height: 70 },
  ]},
];
