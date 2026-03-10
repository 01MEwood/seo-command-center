import { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Btn } from '../components/ui';
import * as api from '../services/api';
import { APP, DOMAINS } from '../config/constants';

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth(null)).finally(() => setLoading(false));
  }, []);

  const services = [
    { name: 'Backend API', check: () => health?.status === 'ok', detail: health?.version },
    { name: 'PostgreSQL', check: () => health?.database === 'connected', detail: health?.database },
    { name: 'DataForSEO', check: () => true, detail: 'Konfiguriert via .env auf Server' },
    { name: 'OpenAI GPT-4o', check: () => true, detail: 'Konfiguriert via .env auf Server' },
    { name: 'Google Search Console', check: () => true, detail: 'OAuth via .env auf Server' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">System-Status und Konfiguration</p>
      </div>

      {/* System Info */}
      <Card title="System">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Version</span>
            <span className="text-white ml-3">{APP.version}</span>
          </div>
          <div>
            <span className="text-gray-500">Architektur</span>
            <span className="text-white ml-3">React + Express + PostgreSQL</span>
          </div>
        </div>
      </Card>

      {/* Service Status */}
      <Card title="Services">
        {loading ? <Spinner /> : (
          <div className="space-y-3">
            {services.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.check() ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-gray-300 text-sm">{s.name}</span>
                </div>
                <span className="text-gray-600 text-xs">{s.detail || '–'}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Domains */}
      <Card title="Domains">
        <div className="space-y-2">
          {Object.entries(DOMAINS).map(([key, d]) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-white text-sm font-medium">{d.name}</span>
                <span className="text-gray-500 text-xs ml-2">{d.url}</span>
              </div>
              <Badge color="blue">{d.territory}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Info */}
      <Card title="API-Keys">
        <p className="text-gray-400 text-sm leading-relaxed">
          Alle API-Keys (DataForSEO, OpenAI, Google) sind serverseitig in der <code className="text-blue-400">.env</code> Datei
          auf dem VPS konfiguriert. Keine Credentials im Browser — alles läuft über das Backend.
        </p>
        <p className="text-gray-600 text-xs mt-3">
          Konfiguration ändern: SSH → <code className="text-gray-500">nano /opt/seo-command-center/.env</code> → <code className="text-gray-500">docker-compose restart</code>
        </p>
      </Card>
    </div>
  );
}
