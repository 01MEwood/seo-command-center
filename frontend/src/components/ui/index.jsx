// ═══════════════════════════════════════════════════════════════════
// Shared UI Components
// Clean, minimal, dark-theme design system
// ═══════════════════════════════════════════════════════════════════

export function Card({ title, children, className = '', actions, noPad }) {
  return (
    <div className={`bg-gray-900/80 border border-gray-800/60 rounded-xl ${noPad ? '' : 'p-5'} ${className}`}>
      {(title || actions) && (
        <div className={`flex items-center justify-between ${noPad ? 'px-5 pt-5' : ''} mb-4`}>
          {title && <h3 className="text-white font-semibold text-sm tracking-wide">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }) {
  const base = 'font-medium rounded-lg transition-all inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800',
    ghost: 'hover:bg-gray-800 text-gray-400',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-800 text-gray-400',
    blue: 'bg-blue-900/40 text-blue-400 border border-blue-800/40',
    green: 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/40',
    red: 'bg-red-900/40 text-red-400 border border-red-800/40',
    yellow: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/40',
    purple: 'bg-purple-900/40 text-purple-400 border border-purple-800/40',
    orange: 'bg-orange-900/40 text-orange-400 border border-orange-800/40',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

export function Spinner({ size = 'sm' }) {
  const dims = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-3' };
  return <div className={`${dims[size]} border-blue-400 border-t-transparent rounded-full animate-spin inline-block`} />;
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="text-center py-16">
      {icon && <div className="text-4xl mb-3 opacity-40">{icon}</div>}
      <p className="text-gray-400 font-medium">{title}</p>
      {desc && <p className="text-gray-600 text-sm mt-1 max-w-md mx-auto">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, className = '', onKeyDown, type = 'text', label, mono }) {
  return (
    <div className={className}>
      {label && <label className="text-gray-500 text-xs block mb-1.5">{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown} placeholder={placeholder}
        className={`w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:bg-gray-800 transition-colors ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

export function Select({ value, onChange, options, className = '', label, placeholder }) {
  return (
    <div className={className}>
      {label && <label className="text-gray-500 text-xs block mb-1.5">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors appearance-none cursor-pointer">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    </div>
  );
}

export function ErrorBox({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="bg-red-900/20 border border-red-800/40 text-red-400 text-sm rounded-lg p-3 flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-600 hover:text-red-400 ml-3">✕</button>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, trend }) {
  const trendColors = { up: 'text-emerald-400', down: 'text-red-400', flat: 'text-gray-500' };
  return (
    <Card>
      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <span className={`text-xs mb-1 ${trendColors[trend.dir] || ''}`}>{trend.label}</span>}
      </div>
      {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
    </Card>
  );
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-900/60 border border-gray-800/40 rounded-lg p-1">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex-1 px-3 py-2 text-xs rounded-md transition-all ${
            active === t.id
              ? 'bg-blue-600/90 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ProgressSteps({ steps, current }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending';
        return (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              state === 'done' ? 'bg-emerald-600 text-white' :
              state === 'active' ? 'bg-blue-600 text-white ring-2 ring-blue-400/30' :
              'bg-gray-800 text-gray-600'
            }`}>
              {state === 'done' ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${
              state === 'active' ? 'text-white font-medium' : 'text-gray-600'
            }`}>{step}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px mx-1 ${
              i < current ? 'bg-emerald-600' : 'bg-gray-800'
            }`} />}
          </div>
        );
      })}
    </div>
  );
}
