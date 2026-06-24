import {
  Calculator,
  ChartNoAxesCombined,
  MessageSquareText,
  PanelsTopLeft,
  UtensilsCrossed,
  Workflow,
} from "lucide-react";

export const vvaiProducts = [
  {
    slug: "neural-command",
    name: "P&L Automation System",
    eyebrow: "FINANCE AUTOMATION",
    description: "Automatically structure revenue, cost, expenses, and profit data so owners can understand performance without messy manual spreadsheets.",
    longDescription: "The P&L Automation System turns scattered numbers into a clearer financial view. It is designed for owners who want a practical way to understand revenue, costs, expenses, and profit without repeating manual spreadsheet work.",
    status: "Available Now",
    availability: "Free to start",
    icon: Calculator,
    gradient: "from-cyan-400/25 via-blue-500/10 to-transparent",
    features: ["Sales breakdown by category", "Category-level cost tracking", "Gross and net profit analysis", "Rule-based business insights"],
    starterHref: "/products/starter",
  },
  {
    slug: "vision-layer",
    name: "Sales Tracking Dashboard",
    eyebrow: "SALES INTELLIGENCE",
    description: "Track sales activity, revenue movement, customer patterns, and business signals in one clean dashboard.",
    longDescription: "The Sales Tracking Dashboard organizes sales activity and revenue movement into one owner-friendly view. It helps teams see patterns, compare results, and respond to useful business signals.",
    status: "Custom Project",
    availability: "Available by request",
    icon: ChartNoAxesCombined,
    gradient: "from-violet-400/25 via-fuchsia-500/10 to-transparent",
    features: ["Sales activity overview", "Revenue movement view", "Customer pattern tracking", "Decision-ready dashboard"],
  },
  {
    slug: "signal-os",
    name: "F&B Operations Dashboard",
    eyebrow: "RESTAURANT OPERATIONS",
    description: "A focused dashboard for restaurants and food businesses to understand sales, orders, performance, and operational signals.",
    longDescription: "The F&B Operations Dashboard brings daily sales, order, and performance signals into one clear view. It is designed for food businesses that need faster visibility without digging through scattered spreadsheets.",
    status: "Prototype",
    availability: "Available by request",
    icon: UtensilsCrossed,
    gradient: "from-cyan-400/20 via-violet-500/10 to-transparent",
    features: ["Sales and order overview", "Performance snapshot", "Owner-friendly dashboard", "Workflow improvement plan"],
  },
  {
    slug: "workflow-automation",
    name: "AI Workflow Automation",
    eyebrow: "BUSINESS AUTOMATION",
    description: "Turn repeated manual tasks into simple automated workflows using AI tools, forms, and dashboards.",
    longDescription: "AI Workflow Automation starts with the manual tasks that waste the most time. The MVP maps the process and turns the right steps into a simple, understandable workflow.",
    status: "Custom Project",
    availability: "Available by request",
    icon: Workflow,
    gradient: "from-violet-400/25 via-cyan-500/10 to-transparent",
    features: ["Workflow mapping", "Form and dashboard concepts", "AI-assisted task flow", "Implementation roadmap"],
  },
  {
    slug: "customer-feedback",
    name: "Customer Feedback System",
    eyebrow: "CUSTOMER INSIGHTS",
    description: "Collect feedback, identify repeated issues, and turn customer opinions into clear improvement actions.",
    longDescription: "The Customer Feedback System turns simple responses into a useful owner view. It helps businesses spot recurring issues and organize practical improvement actions.",
    status: "Prototype",
    availability: "Available by request",
    icon: MessageSquareText,
    gradient: "from-violet-400/25 via-fuchsia-500/10 to-transparent",
    features: ["Simple response collection", "Common issue summaries", "Customer insight dashboard", "Improvement action list"],
  },
  {
    slug: "business-website-mvp",
    name: "Business Website MVP",
    eyebrow: "DIGITAL PRESENCE",
    description: "A clean website MVP that helps customers understand the business, contact the owner, and take action.",
    longDescription: "The Business Website MVP creates a clear, credible digital presence without unnecessary complexity. It focuses on the information and actions customers need most.",
    status: "Custom Project",
    availability: "Available by request",
    icon: PanelsTopLeft,
    gradient: "from-cyan-400/20 via-violet-500/10 to-transparent",
    features: ["Responsive website MVP", "Clear service positioning", "Contact and action flows", "Practical launch roadmap"],
  },
];

export const starterIndustries = [
  "Restaurant / F&B",
  "Retail",
  "E-commerce",
  "Service Business",
  "Manufacturing",
  "Custom Business",
] as const;

export type StarterIndustry = (typeof starterIndustries)[number];
export type StarterItemGroup = "revenue" | "cost" | "expenses";

export const starterPresets: Record<StarterIndustry, Record<StarterItemGroup, string[]>> = {
  "Restaurant / F&B": {
    revenue: ["Dine-in sales", "Delivery sales", "Catering or events"],
    cost: ["Food ingredients", "Beverage ingredients", "Packaging"],
    expenses: ["Rent", "Staff wages", "Utilities", "Marketing"],
  },
  Retail: {
    revenue: ["Store sales", "Online sales", "Wholesale orders"],
    cost: ["Product inventory", "Packaging", "Shipping cost"],
    expenses: ["Rent", "Staff wages", "Marketing", "Software tools"],
  },
  "E-commerce": {
    revenue: ["Website sales", "Marketplace sales", "Repeat customer sales"],
    cost: ["Product cost", "Fulfilment", "Shipping subsidy"],
    expenses: ["Advertising", "Platform fees", "Software tools", "Contractors"],
  },
  "Service Business": {
    revenue: ["Service packages", "Retainers", "One-time projects"],
    cost: ["Contract labour", "Tools used per project", "Travel or delivery"],
    expenses: ["Software subscriptions", "Marketing", "Admin expenses", "Owner salary"],
  },
  Manufacturing: {
    revenue: ["Finished goods sales", "Bulk orders", "Custom production"],
    cost: ["Raw materials", "Production labour", "Packaging"],
    expenses: ["Factory rent", "Machine maintenance", "Utilities", "Logistics"],
  },
  "Custom Business": {
    revenue: ["Main revenue", "Secondary revenue", "Other revenue"],
    cost: ["Direct cost", "Delivery or fulfilment", "Materials"],
    expenses: ["Rent", "Payroll", "Marketing", "Software"],
  },
};
