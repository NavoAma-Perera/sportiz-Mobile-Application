// src/constants/colors.ts
const Light = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  accent: '#ec4899',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
};

const Dark = {
  primary: '#818cf8',
  primaryLight: '#a78bfa',
  accent: '#f472b6',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#ffffff',
  textSecondary: '#cbd5e1',
};

// Export a function that takes isDark
export const Colors = (isDark: boolean) => (isDark ? Dark : Light);