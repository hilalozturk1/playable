import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: 'Rose', value: 'rose' as const, color: 'bg-rose-500' },
    { name: 'Blue', value: 'blue' as const, color: 'bg-blue-500' },
    { name: 'Green', value: 'green' as const, color: 'bg-green-500' },
    { name: 'Purple', value: 'purple' as const, color: 'bg-purple-500' },
    { name: 'Orange', value: 'orange' as const, color: 'bg-orange-500' },
    { name: 'Black', value: 'black' as const, color: 'bg-gray-900' },
    { name: 'White', value: 'white' as const, color: 'bg-white border border-gray-300' },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-bold text-white transition-all shadow-md"
        title="Tema Seç"
      >
        <div className={`w-5 h-5 rounded-full ${currentTheme?.color || 'bg-rose-500'}`}></div>
        <span className="hidden md:inline">{currentTheme?.name || 'Tema'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-4 border-gray-200 z-50 overflow-hidden">
            <div className="p-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                    theme === t.value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${t.color}`}></div>
                  <span>{t.name}</span>
                  {theme === t.value && (
                    <svg className="w-5 h-5 ml-auto text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

