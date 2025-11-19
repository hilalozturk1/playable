module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./contexts/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // Theme colors - Rose
    'from-rose-500', 'to-pink-500', 'via-pink-500', 'via-rose-50', 'via-rose-100', 'border-rose-600', 'border-rose-700', 'bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700', 'bg-rose-800', 'text-rose-600', 'text-rose-700', 'text-rose-900', 'border-rose-200', 'border-rose-300', 'border-rose-400', 'bg-rose-50', 'bg-rose-100', 'hover:border-rose-400', 'hover:bg-rose-50', 'hover:bg-rose-700', 'focus:ring-rose-500', 'focus:ring-rose-300',
    // Theme colors - Blue
    'from-blue-500', 'to-cyan-500', 'via-cyan-500', 'via-blue-50', 'via-blue-100', 'border-blue-600', 'border-blue-700', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'text-blue-600', 'text-blue-700', 'text-blue-900', 'border-blue-200', 'border-blue-300', 'border-blue-400', 'bg-blue-50', 'bg-blue-100', 'hover:border-blue-400', 'hover:bg-blue-50', 'hover:bg-blue-700', 'focus:ring-blue-500', 'focus:ring-blue-300',
    // Theme colors - Green
    'from-green-500', 'to-emerald-500', 'via-emerald-500', 'via-green-50', 'via-green-100', 'border-green-600', 'border-green-700', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'text-green-600', 'text-green-700', 'text-green-900', 'border-green-200', 'border-green-300', 'border-green-400', 'bg-green-50', 'bg-green-100', 'hover:border-green-400', 'hover:bg-green-50', 'hover:bg-green-700', 'focus:ring-green-500', 'focus:ring-green-300',
    // Theme colors - Purple
    'from-purple-500', 'to-violet-500', 'via-violet-500', 'via-purple-50', 'via-purple-100', 'border-purple-600', 'border-purple-700', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'text-purple-600', 'text-purple-700', 'text-purple-900', 'border-purple-200', 'border-purple-300', 'border-purple-400', 'bg-purple-50', 'bg-purple-100', 'hover:border-purple-400', 'hover:bg-purple-50', 'hover:bg-purple-700', 'focus:ring-purple-500', 'focus:ring-purple-300',
    // Theme colors - Orange
    'from-orange-500', 'to-amber-500', 'via-amber-500', 'via-orange-50', 'via-orange-100', 'border-orange-600', 'border-orange-700', 'bg-orange-400', 'bg-orange-500', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800', 'text-orange-600', 'text-orange-700', 'text-orange-900', 'border-orange-200', 'border-orange-300', 'border-orange-400', 'bg-orange-50', 'bg-orange-100', 'hover:border-orange-400', 'hover:bg-orange-50', 'hover:bg-orange-700', 'focus:ring-orange-500', 'focus:ring-orange-300',
    // Theme colors - Black
    'from-gray-800', 'to-gray-700', 'via-gray-700', 'via-gray-900', 'via-gray-800', 'via-gray-600', 'border-gray-700', 'border-gray-800', 'bg-gray-900', 'bg-gray-800', 'bg-black', 'bg-gray-600', 'text-white', 'text-black', 'text-gray-200', 'border-black', 'bg-gray-700', 'hover:bg-black', 'hover:bg-gray-900', 'hover:border-gray-700', 'focus:ring-gray-900', 'focus:ring-gray-800',
    // Theme colors - White
    'from-gray-100', 'to-gray-200', 'via-gray-200', 'via-gray-300', 'via-gray-50', 'via-white', 'border-gray-200', 'border-gray-300', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-white', 'text-gray-900', 'text-gray-700', 'text-gray-500', 'hover:bg-gray-100', 'hover:border-gray-300', 'focus:ring-gray-200', 'focus:ring-gray-300',
  ]
};
