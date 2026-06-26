 export interface TemplateSlideElement {
  type: "text" | "image" | "shape";
  role: "title" | "subtitle" | "body" | "accent";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
}

export interface TemplateSlide {
  backgroundType: "color" | "gradient";
  backgroundValue: string;
  elements: TemplateSlideElement[];
}

export interface TemplateDefinition {
  name: string;
  category: "marketing" | "business" | "developer" | "creative" | "education" | "minimal";
  description: string;
  themeName: string;
  slides: TemplateSlide[];
}

export const templateDefinitions: TemplateDefinition[] = [
  // ===================== MARKETING (5) =====================
  {
    name: "Pitch Deck",
    category: "marketing",
    description: "Startup pitch deck with problem, solution, market, and ask slides",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Company Name", fontSize: 56, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Tagline that captures your vision", fontSize: 24, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "The Problem", fontSize: 40, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 360, content: "Describe the pain point your customers face.\n\n• Key insight #1\n• Key insight #2\n• Key insight #3", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Our Solution", fontSize: 40, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 360, content: "How we solve this problem better than anyone else", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Market Opportunity", fontSize: 40, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 360, content: "$X Billion TAM\n\nGrowing at Y% annually", fontSize: 28, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#3b82f6", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "The Ask", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "We're raising $X to achieve Y", fontSize: 24, fontWeight: "400", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Product Launch",
    category: "marketing",
    description: "Announce a new product with features and pricing",
    themeName: "Cool Gray",
    slides: [
      { backgroundType: "gradient", backgroundValue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", elements: [
        { type: "text", role: "title", x: 80, y: 180, width: 800, height: 80, content: "Introducing Product X", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 290, width: 600, height: 50, content: "The future of [category]", fontSize: 24, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Key Features", fontSize: 40, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 360, content: "✨ Feature One\nDescription of the benefit\n\n🚀 Feature Two\nDescription of the benefit", fontSize: 20, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 500, y: 120, width: 380, height: 360, content: "🎯 Feature Three\nDescription of the benefit\n\n💡 Feature Four\nDescription of the benefit", fontSize: 20, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Pricing", fontSize: 40, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "body", x: 40, y: 100, width: 280, height: 400, content: "Free\n\n$0/mo\n\n• Basic features\n• 1 user", fontSize: 18, fontWeight: "400", textAlign: "center" },
        { type: "text", role: "body", x: 340, y: 100, width: 280, height: 400, content: "Pro\n\n$29/mo\n\n• All features\n• 10 users", fontSize: 18, fontWeight: "400", textAlign: "center" },
        { type: "text", role: "body", x: 640, y: 100, width: 280, height: 400, content: "Enterprise\n\nCustom\n\n• Unlimited\n• Priority support", fontSize: 18, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "gradient", backgroundValue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", elements: [
        { type: "text", role: "title", x: 160, y: 200, width: 640, height: 80, content: "Get Started Today", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 230, y: 300, width: 500, height: 50, content: "Sign up at product.com", fontSize: 24, fontWeight: "400", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Campaign Report",
    category: "marketing",
    description: "Marketing campaign results and analytics",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Q4 Campaign Report", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Performance Summary & Insights", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Key Metrics", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 40, y: 100, width: 200, height: 200, content: "12.5K\nImpressions", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 280, y: 100, width: 200, height: 200, content: "3.2%\nCTR", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 520, y: 100, width: 200, height: 200, content: "847\nConversions", fontSize: 20, fontWeight: "600", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Channel Performance", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Social Media: 45% of traffic\n• Email: 30% of traffic\n• Paid Ads: 20% of traffic\n• Organic: 5% of traffic", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Brand Guidelines",
    category: "marketing",
    description: "Brand identity and visual guidelines",
    themeName: "Midnight",
    slides: [
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Brand Guidelines", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Visual Identity System 2024", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Color Palette", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 360, content: "Primary: #3B82F6\nSecondary: #10B981\nAccent: #F59E0B\nNeutral: #64748B", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Typography", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 360, content: "Headings: Inter Bold\nBody: Inter Regular\nAccent: Georgia Italic", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Social Media Strategy",
    category: "marketing",
    description: "Social media plan and content strategy",
    themeName: "Soft Rose",
    slides: [
      { backgroundType: "color", backgroundValue: "#fff1f2", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Social Media Strategy", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Content Plan for Q1 2024", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#fff1f2", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Platform Overview", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 360, content: "Instagram\n• 3 posts/week\n• Stories daily\n• Reels 2x/week", fontSize: 18, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 500, y: 120, width: 380, height: 360, content: "LinkedIn\n• 2 posts/week\n• Articles monthly\n• Engagement daily", fontSize: 18, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#fff1f2", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Content Calendar", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Week 1: Brand Awareness\nWeek 2: Product Spotlight\nWeek 3: User Stories\nWeek 4: Behind the Scenes", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },

  // ===================== BUSINESS (5) =====================
  {
    name: "Corporate Report",
    category: "business",
    description: "Quarterly or annual corporate report",
    themeName: "Cool Gray",
    slides: [
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Annual Report 2024", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Company Performance Overview", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 400, height: 60, content: "Agenda", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "1. Financial Highlights\n2. Key Achievements\n3. Market Analysis\n4. Strategic Outlook\n5. Q&A", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Financial Highlights", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 40, y: 100, width: 200, height: 200, content: "$24M\nRevenue", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 280, y: 100, width: 200, height: 200, content: "32%\nGrowth", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 520, y: 100, width: 200, height: 200, content: "150+\nClients", fontSize: 20, fontWeight: "600", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Strategic Outlook", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Expand to 3 new markets\n• Launch 2 new products\n• Achieve 50% revenue growth\n• Grow team by 40%", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Business Plan",
    category: "business",
    description: "Comprehensive business plan presentation",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Business Plan", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "FY 2024–2025", fontSize: 24, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Executive Summary", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Our company provides [solution] to [market]. We aim to capture X% market share within 2 years through our differentiated approach to [problem].", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Revenue Model", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• SaaS Subscriptions: 70%\n• Enterprise Licenses: 20%\n• Professional Services: 10%", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 300, y: 20, width: 360, height: 40, content: "SWOT Analysis", fontSize: 32, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "body", x: 40, y: 80, width: 430, height: 210, content: "Strengths\n• Strong team\n• Unique tech", fontSize: 18, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 490, y: 80, width: 430, height: 210, content: "Weaknesses\n• Limited funding\n• Small team", fontSize: 18, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 40, y: 310, width: 430, height: 210, content: "Opportunities\n• Growing market\n• New regulations", fontSize: 18, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 490, y: 310, width: 430, height: 210, content: "Threats\n• Big tech entry\n• Economic downturn", fontSize: 18, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Quarterly Review",
    category: "business",
    description: "Quarterly business performance review",
    themeName: "Cool Gray",
    slides: [
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Q3 2024 Review", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Team Performance & Goals", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "OKR Progress", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "Objective 1: Grow Revenue — 85% complete\nObjective 2: Improve NPS — 92% complete\nObjective 3: Scale Team — 70% complete", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Next Quarter Goals", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "1. Launch v2.0 by end of quarter\n2. Onboard 20 new enterprise clients\n3. Reduce churn to < 5%\n4. Hire 10 engineers", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Company Profile",
    category: "business",
    description: "Company overview for clients and partners",
    themeName: "Midnight",
    slides: [
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Company Name", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Building the future of [industry]", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "About Us", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Founded in 2020, we help companies [value prop]. Our platform serves 500+ businesses across 30 countries.", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Our Team", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 380, content: "50+ talented professionals\n\n• Engineering: 25\n• Product: 8\n• Sales: 10\n• Operations: 7", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Investor Update",
    category: "business",
    description: "Monthly or quarterly investor update",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Investor Update", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "March 2024", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Key Metrics", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 40, y: 100, width: 280, height: 200, content: "MRR\n$450K\n↑ 15%", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 340, y: 100, width: 280, height: 200, content: "Customers\n1,200\n↑ 22%", fontSize: 20, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "body", x: 640, y: 100, width: 280, height: 200, content: "NPS\n72\n↑ 8pts", fontSize: 20, fontWeight: "600", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Runway & Burn", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Cash on hand: $2.1M\nMonthly burn: $180K\nRunway: 11.5 months\n\nPath to profitability: Q4 2024", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },

  // ===================== DEVELOPER (5) =====================
  {
    name: "Tech Talk",
    category: "developer",
    description: "Technical presentation for conferences or meetups",
    themeName: "Charcoal",
    slides: [
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 180, width: 800, height: 80, content: "Building Scalable APIs", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 290, width: 600, height: 50, content: "Lessons from handling 1M requests/sec", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Architecture Overview", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 60, y: 100, width: 840, height: 400, content: "┌─────────┐    ┌──────────┐    ┌─────────┐\n│  Client  │ →  │ API GW   │ →  │ Service │\n└─────────┘    └──────────┘    └─────────┘\n                                     ↓\n                              ┌─────────┐\n                              │   DB    │\n                              └─────────┘", fontSize: 16, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Key Takeaways", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "1. Cache everything you can\n2. Use connection pooling\n3. Implement rate limiting early\n4. Monitor before you need to\n5. Design for failure", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Thank You!", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "@handle • github.com/username", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Sprint Review",
    category: "developer",
    description: "Sprint retrospective and demo",
    themeName: "Dark Slate",
    slides: [
      { backgroundType: "color", backgroundValue: "#1e293b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Sprint 14 Review", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Dec 4–18, 2024", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#1e293b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Sprint Goals", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "✅ Implement user authentication\n✅ Add dashboard analytics\n⬜ Performance optimization\n✅ Fix critical bugs (5/5)", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#1e293b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Velocity", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "Committed: 34 points\nCompleted: 29 points\nCarryover: 5 points\n\nVelocity trend: ↑ improving", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Architecture Proposal",
    category: "developer",
    description: "System architecture design proposal",
    themeName: "Deep Ocean",
    slides: [
      { backgroundType: "color", backgroundValue: "#0c4a6e", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Architecture Proposal", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Microservices Migration Plan", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#0c4a6e", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Current State", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Monolithic application\n• Single deployment unit\n• Shared database\n• Tight coupling between modules\n• Deployment takes 45min", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#0c4a6e", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Proposed Architecture", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 380, content: "Service Mesh\n• Auth Service\n• User Service\n• Payment Service\n• Notification Service", fontSize: 20, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 500, y: 120, width: 380, height: 380, content: "Infrastructure\n• Kubernetes\n• Service Mesh\n• Event Bus\n• Distributed Cache", fontSize: 20, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#0c4a6e", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Migration Timeline", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Phase 1 (Q1): Extract Auth + User services\nPhase 2 (Q2): Extract Payment service\nPhase 3 (Q3): Event-driven architecture\nPhase 4 (Q4): Full migration complete", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Release Notes",
    category: "developer",
    description: "Product release notes and changelog",
    themeName: "Forest Night",
    slides: [
      { backgroundType: "color", backgroundValue: "#14532d", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "v2.5.0 Release", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "What's new in this release", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#14532d", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "New Features", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "🎉 Dark mode support\n🎉 Real-time collaboration\n🎉 Custom dashboard widgets\n🎉 API v2 with GraphQL", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#14532d", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "Bug Fixes & Improvements", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 800, height: 400, content: "🐛 Fixed memory leak in WebSocket handler\n🐛 Resolved race condition in queue\n⚡ 40% faster page loads\n⚡ Reduced bundle size by 25%", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Hackathon Pitch",
    category: "developer",
    description: "Quick demo pitch for hackathons",
    themeName: "Royal Purple",
    slides: [
      { backgroundType: "gradient", backgroundValue: "linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)", elements: [
        { type: "text", role: "title", x: 80, y: 180, width: 800, height: 80, content: "Project Name", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 290, width: 600, height: 50, content: "Hackathon 2024 — Team Alpha", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#2e1065", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "The Problem", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "X million people struggle with [problem] every day.\n\nCurrent solutions are slow, expensive, and inaccessible.", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#2e1065", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Our Solution", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "We built [product] using:\n\n• AI/ML for [capability]\n• Real-time processing\n• Beautiful UX\n\nDemo time! 🚀", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },

  // ===================== CREATIVE (4) =====================
  {
    name: "Portfolio Showcase",
    category: "creative",
    description: "Design portfolio presentation",
    themeName: "Charcoal",
    slides: [
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Portfolio", fontSize: 56, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Selected Works 2024", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 500, height: 50, content: "Project One", fontSize: 32, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 90, width: 400, height: 200, content: "Brand identity redesign for a fintech startup. Created logo, color system, and marketing materials.", fontSize: 18, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 500, height: 50, content: "Project Two", fontSize: 32, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 90, width: 400, height: 200, content: "Mobile app UI/UX for a health tracking platform. Designed 40+ screens with a focus on accessibility.", fontSize: 18, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Let's Work Together", fontSize: 42, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "hello@designer.com", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Design Proposal",
    category: "creative",
    description: "Client-facing design proposal",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Design Proposal", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Website Redesign for Client Co.", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Project Scope", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Homepage redesign\n• Product pages (12 templates)\n• Blog layout\n• Mobile responsive\n• Design system documentation", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Timeline & Budget", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 380, content: "Timeline\n\nWeek 1–2: Research\nWeek 3–4: Wireframes\nWeek 5–6: Visual Design\nWeek 7–8: Delivery", fontSize: 20, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 500, y: 120, width: 380, height: 380, content: "Investment\n\nDesign: $15,000\nPrototype: $5,000\nDesign System: $8,000\n\nTotal: $28,000", fontSize: 20, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Photo Essay",
    category: "creative",
    description: "Visual storytelling with images",
    themeName: "Midnight",
    slides: [
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 80, y: 220, width: 800, height: 80, content: "A Visual Journey", fontSize: 52, fontWeight: "700", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "body", x: 120, y: 150, width: 720, height: 200, content: "\"Every picture tells a story, but some stories need more than one picture.\"", fontSize: 28, fontWeight: "400", textAlign: "center" },
        { type: "text", role: "subtitle", x: 300, y: 380, width: 360, height: 40, content: "— Unknown", fontSize: 18, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#0f172a", elements: [
        { type: "text", role: "title", x: 520, y: 150, width: 400, height: 80, content: "Chapter One", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 520, y: 250, width: 400, height: 200, content: "The beginning of the visual narrative. Set the scene and introduce the theme.", fontSize: 20, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Art Exhibition",
    category: "creative",
    description: "Art show or gallery presentation",
    themeName: "Charcoal",
    slides: [
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Exhibition Title", fontSize: 52, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Artist Name • Gallery • 2024", fontSize: 20, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Artist Statement", fontSize: 32, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "This body of work explores the intersection of [theme] and [theme]. Through [medium], I investigate how [concept] shapes our perception of [subject].", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 450, width: 400, height: 40, content: "Untitled #1, 2024", fontSize: 16, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },

  // ===================== EDUCATION (4) =====================
  {
    name: "Lecture",
    category: "education",
    description: "Academic lecture or class presentation",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 180, width: 800, height: 80, content: "Introduction to Algorithms", fontSize: 44, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 280, width: 600, height: 50, content: "CS 201 — Week 5: Sorting", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Today's Agenda", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "1. Review: Big-O Notation\n2. Bubble Sort\n3. Merge Sort\n4. Quick Sort\n5. Comparison & Analysis\n6. Practice Problems", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 100, width: 800, height: 80, content: "What is Sorting?", fontSize: 40, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 120, y: 220, width: 720, height: 250, content: "Sorting is the process of rearranging a sequence of objects so as to put them in some logical order.\n\nTime complexity ranges from O(n log n) to O(n²)", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Key Takeaways", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Merge Sort: O(n log n) — stable, predictable\n• Quick Sort: O(n log n) average — fast in practice\n• Choice depends on data characteristics\n\n📚 Reading: Chapter 7–8", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Workshop",
    category: "education",
    description: "Interactive workshop or training session",
    themeName: "Nature Green",
    slides: [
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Workshop Title", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Hands-on Learning Session", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 30, width: 800, height: 50, content: "What You'll Learn", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 100, width: 250, height: 380, content: "Step 1\n\nSetup your environment and install dependencies", fontSize: 18, fontWeight: "400", textAlign: "center" },
        { type: "text", role: "body", x: 355, y: 100, width: 250, height: 380, content: "Step 2\n\nBuild the core feature following the guide", fontSize: 18, fontWeight: "400", textAlign: "center" },
        { type: "text", role: "body", x: 630, y: 100, width: 250, height: 380, content: "Step 3\n\nDeploy and test your creation", fontSize: 18, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 80, content: "Exercise Time! 🧪", fontSize: 40, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "body", x: 120, y: 160, width: 720, height: 300, content: "Open your terminal and follow along:\n\n1. Clone the repo\n2. Install dependencies\n3. Run the starter project\n\n⏱️ You have 15 minutes", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Research Presentation",
    category: "education",
    description: "Academic research findings presentation",
    themeName: "Cool Gray",
    slides: [
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 180, width: 800, height: 80, content: "Research Title", fontSize: 40, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 120, y: 280, width: 720, height: 80, content: "Author Name\nDepartment • University • 2024", fontSize: 18, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Research Question", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "How does [variable X] affect [outcome Y] in [context Z]?\n\nHypothesis: We expect that [prediction] because [reasoning].", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Methodology", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Participants: N = 200\n• Design: 2x2 factorial\n• Measures: [Instrument]\n• Analysis: ANOVA + regression", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Conclusions", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "• Finding 1 supports H1\n• Finding 2 partially supports H2\n• Limitations: sample size, generalizability\n• Future work: longitudinal study", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Course Overview",
    category: "education",
    description: "Course introduction and syllabus",
    themeName: "Nature Green",
    slides: [
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Course Title", fontSize: 48, fontWeight: "700", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Semester 2024 — Instructor Name", fontSize: 22, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Course Objectives", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "By the end of this course, you will be able to:\n\n1. Understand [concept]\n2. Apply [skill]\n3. Analyze [topic]\n4. Create [deliverable]", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#f0fdf4", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Grading", fontSize: 36, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 380, content: "Assignments: 40%\nMidterm: 20%\nFinal Project: 30%\nParticipation: 10%", fontSize: 22, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 500, y: 120, width: 380, height: 380, content: "Schedule\n\nWeek 1–4: Foundations\nWeek 5–8: Application\nWeek 9–12: Advanced\nWeek 13–14: Projects", fontSize: 22, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },

  // ===================== MINIMAL (4) =====================
  {
    name: "Clean Minimal",
    category: "minimal",
    description: "Ultra-clean presentation with minimal elements",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 220, width: 800, height: 80, content: "Title", fontSize: 56, fontWeight: "300", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Topic", fontSize: 40, fontWeight: "300", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 140, width: 800, height: 340, content: "Content goes here.", fontSize: 22, fontWeight: "300", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 220, width: 800, height: 80, content: "Thank You", fontSize: 48, fontWeight: "300", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Modern Mono",
    category: "minimal",
    description: "Monochrome modern aesthetic",
    themeName: "Charcoal",
    slides: [
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "PRESENTATION", fontSize: 52, fontWeight: "800", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "SUBTITLE HERE", fontSize: 16, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#18181b", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "SECTION", fontSize: 36, fontWeight: "800", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 140, width: 800, height: 340, content: "Minimalist content with maximum impact.", fontSize: 22, fontWeight: "300", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#fafafa", elements: [
        { type: "text", role: "title", x: 80, y: 220, width: 800, height: 80, content: "CONTRAST", fontSize: 52, fontWeight: "800", textAlign: "center" },
      ]},
    ],
  },
  {
    name: "Swiss Design",
    category: "minimal",
    description: "Grid-based Swiss/International style",
    themeName: "Clean White",
    slides: [
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 80, width: 500, height: 120, content: "Swiss\nDesign", fontSize: 64, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 400, width: 300, height: 80, content: "Grid-based. Functional.\nTimeless.", fontSize: 16, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#ffffff", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 400, height: 60, content: "Structure", fontSize: 48, fontWeight: "700", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 380, height: 380, content: "Content organized\nin a clear grid\nwith purpose.", fontSize: 20, fontWeight: "400", textAlign: "left" },
        { type: "text", role: "body", x: 520, y: 120, width: 380, height: 380, content: "Every element\nhas a reason\nto exist.", fontSize: 20, fontWeight: "400", textAlign: "left" },
      ]},
    ],
  },
  {
    name: "Flat & Simple",
    category: "minimal",
    description: "Flat design with simple colors",
    themeName: "Cool Gray",
    slides: [
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 200, width: 800, height: 80, content: "Simple Works", fontSize: 48, fontWeight: "600", textAlign: "center" },
        { type: "text", role: "subtitle", x: 180, y: 300, width: 600, height: 50, content: "Less is more", fontSize: 20, fontWeight: "400", textAlign: "center" },
      ]},
      { backgroundType: "color", backgroundValue: "#f8fafc", elements: [
        { type: "text", role: "title", x: 80, y: 40, width: 800, height: 60, content: "Point One", fontSize: 36, fontWeight: "600", textAlign: "left" },
        { type: "text", role: "body", x: 80, y: 120, width: 800, height: 380, content: "Keep things straightforward.\nOne idea per slide.\nLet whitespace breathe.", fontSize: 24, fontWeight: "400", textAlign: "left" },
      ]},
      { backgroundType: "color", backgroundValue: "#6366f1", elements: [
        { type: "text", role: "title", x: 80, y: 220, width: 800, height: 80, content: "Questions?", fontSize: 48, fontWeight: "600", textAlign: "center" },
      ]},
    ],
  },
];
