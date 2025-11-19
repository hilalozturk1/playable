import { useState } from 'react';
import api from '../lib/api';
import Router from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

export default function RegisterPage() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      Router.push('/login');
    } catch (err) {
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'Registration failed' } })); } catch {}
    }
  };

  return (
    <div className={`py-12 px-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-${colors.bg} to-white`}>
      <div className={`max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border-4 border-${colors.border}`}>
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-2`}>Hesap Oluştur</h1>
        <p className={`text-lg text-${colors.primaryDark} mb-8 font-semibold`}>Bize katılın ve alışverişe başlayın</p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>İsim</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-full focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
              placeholder="İsminiz"
            />
          </div>
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Email</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email"
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-full focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Şifre</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-full focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
              placeholder="••••••••"
            />
          </div>
          <div>
            <button className={`w-full px-8 py-3 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-lg hover:shadow-xl`}>
              Hesap Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
