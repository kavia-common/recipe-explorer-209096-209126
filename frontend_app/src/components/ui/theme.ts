export const theme = {
  colors: {
    primary: '#2563EB', // blue-600
    primaryHover: '#1D4ED8', // blue-700
    secondary: '#F59E0B', // amber-500
    error: '#EF4444', // red-500
    background: '#f9fafb', // gray-50
    surface: '#ffffff', // white
    text: '#111827', // gray-900
    mutedText: '#6B7280', // gray-500
    border: '#E5E7EB', // gray-200
    focus: '#93C5FD', // blue-300
    gradientFrom: 'rgba(59,130,246,0.1)', // blue-500/10
    gradientTo: '#f9fafb',
    tagBg: '#EFF6FF', // blue-50
    tagText: '#1E40AF', // blue-800
    skeletonFrom: '#e5e7eb',
    skeletonTo: '#f3f4f6'
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 10px rgba(2, 6, 23, 0.06)',
    hover: '0 8px 22px rgba(2, 6, 23, 0.10)',
    inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
  },
  transitions: {
    base: 'all 200ms ease',
    fast: 'all 120ms ease',
  }
} as const;

export type Theme = typeof theme;
