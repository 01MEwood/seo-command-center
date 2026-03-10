import { useState } from 'react';
import { APP } from '../config/constants';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const result = await onLogin(email, password);
    if (!result.ok) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-1 bg-blue-600/5 rounded-3xl blur-xl" />
        <div className="relative bg-gray-900/90 border border-gray-800/60 rounded-2xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-400 text-lg font-bold">M</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">{APP.name}</h1>
            <p className="text-gray-600 text-xs mt-1">{APP.version} · {APP.subtitle}</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-xs rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Email oder Benutzername"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              autoFocus
            />
            <input
              className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Passwort"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
            />
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium rounded-lg py-3 text-sm transition-colors shadow-lg shadow-blue-600/20 mt-2"
            >
              {loading ? 'Einloggen...' : 'Einloggen'}
            </button>
          </form>

          <p className="text-gray-700 text-[10px] text-center mt-6">Schreinerhelden GmbH & Co. KG</p>
        </div>
      </div>
    </div>
  );
}
