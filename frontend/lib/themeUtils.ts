import { ThemeColors } from '../contexts/ThemeContext';

export function getThemeClasses(colors: ThemeColors) {
  return {
    header: `bg-${colors.primaryLight} border-b-4 border-${colors.primaryDark}`,
    footer: `border-t-4 border-${colors.accent} bg-${colors.primaryLight}`,
    button: `bg-${colors.primary} hover:bg-${colors.primaryDark} text-white`,
    buttonOutline: `border-2 border-${colors.primary} text-${colors.primaryDark} hover:bg-${colors.primaryLight} hover:text-white`,
    card: `border-4 border-${colors.border} bg-white`,
    bg: `bg-${colors.bg}`,
    text: `text-${colors.text}`,
    badge: `bg-${colors.primaryDark} text-white`,
  };
}

// Tailwind safelist için tüm olası class kombinasyonları
export const themeSafelist = [
  // Rose
  'from-rose-500', 'to-pink-500', 'border-rose-600', 'border-rose-700', 'bg-rose-600', 'bg-rose-700', 'bg-rose-800', 'text-rose-600', 'text-rose-700', 'text-rose-900', 'border-rose-200', 'border-rose-300', 'border-rose-400', 'bg-rose-50', 'bg-rose-100',
  // Blue
  'from-blue-500', 'to-cyan-500', 'border-blue-600', 'border-blue-700', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'text-blue-600', 'text-blue-700', 'text-blue-900', 'border-blue-200', 'border-blue-300', 'border-blue-400', 'bg-blue-50', 'bg-blue-100',
  // Green
  'from-green-500', 'to-emerald-500', 'border-green-600', 'border-green-700', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'text-green-600', 'text-green-700', 'text-green-900', 'border-green-200', 'border-green-300', 'border-green-400', 'bg-green-50', 'bg-green-100',
  // Purple
  'from-purple-500', 'to-violet-500', 'border-purple-600', 'border-purple-700', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'text-purple-600', 'text-purple-700', 'text-purple-900', 'border-purple-200', 'border-purple-300', 'border-purple-400', 'bg-purple-50', 'bg-purple-100',
  // Orange
  'from-orange-500', 'to-amber-500', 'border-orange-600', 'border-orange-700', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800', 'text-orange-600', 'text-orange-700', 'text-orange-900', 'border-orange-200', 'border-orange-300', 'border-orange-400', 'bg-orange-50', 'bg-orange-100',
];

