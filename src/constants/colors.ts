const Light = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  accent: '#ec4899',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  cardBg: '#ffffff',
  glassBg: 'rgba(255, 255, 255, 0.92)',
  inputBg: '#f1f5f9',
};

const Dark = {
  primary: '#a78bfa',     
  primaryLight: '#c4b5fd', 
  accent: '#f472b6',      
  background: '#0f172a',
  surface: '#1e293b',
  text: '#ffffff',
  textSecondary: '#94a3b8', 
  border: '#334155',
  cardBg: 'rgba(30, 41, 59, 0.85)',
  glassBg: 'rgba(15, 23, 42, 0.9)',
  inputBg: 'rgba(255,255,255,0.12)', 
};

export const Colors = (isDark: boolean) => (isDark ? Dark : Light);