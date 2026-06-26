export interface ThemePreset {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  isDark: boolean;
}

export const themePresets: ThemePreset[] = [
  // Light themes
  { name: "Clean White", backgroundColor: "#ffffff", textColor: "#1f2937", accentColor: "#3b82f6", headingFont: "Inter", bodyFont: "Inter", isDark: false },
  { name: "Warm Cream", backgroundColor: "#fefce8", textColor: "#422006", accentColor: "#d97706", headingFont: "Georgia", bodyFont: "Inter", isDark: false },
  { name: "Cool Gray", backgroundColor: "#f8fafc", textColor: "#334155", accentColor: "#6366f1", headingFont: "Inter", bodyFont: "Inter", isDark: false },
  { name: "Soft Rose", backgroundColor: "#fff1f2", textColor: "#4c0519", accentColor: "#e11d48", headingFont: "Inter", bodyFont: "Inter", isDark: false },
  { name: "Nature Green", backgroundColor: "#f0fdf4", textColor: "#14532d", accentColor: "#16a34a", headingFont: "Inter", bodyFont: "Inter", isDark: false },
  // Dark themes
  { name: "Midnight", backgroundColor: "#0f172a", textColor: "#e2e8f0", accentColor: "#38bdf8", headingFont: "Inter", bodyFont: "Inter", isDark: true },
  { name: "Dark Slate", backgroundColor: "#1e293b", textColor: "#f1f5f9", accentColor: "#a78bfa", headingFont: "Inter", bodyFont: "Inter", isDark: true },
  { name: "Charcoal", backgroundColor: "#18181b", textColor: "#fafafa", accentColor: "#f59e0b", headingFont: "Inter", bodyFont: "Inter", isDark: true },
  { name: "Deep Ocean", backgroundColor: "#0c4a6e", textColor: "#e0f2fe", accentColor: "#22d3ee", headingFont: "Inter", bodyFont: "Inter", isDark: true },
  { name: "Forest Night", backgroundColor: "#14532d", textColor: "#dcfce7", accentColor: "#4ade80", headingFont: "Inter", bodyFont: "Inter", isDark: true },
  { name: "Sunset", backgroundColor: "#431407", textColor: "#fff7ed", accentColor: "#fb923c", headingFont: "Georgia", bodyFont: "Inter", isDark: true },
  { name: "Royal Purple", backgroundColor: "#2e1065", textColor: "#f5f3ff", accentColor: "#c084fc", headingFont: "Inter", bodyFont: "Inter", isDark: true },
];
