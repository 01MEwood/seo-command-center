import { useState, useEffect, useCallback } from 'react';
import { Card, Btn, Badge, Spinner, Input, Select, ErrorBox } from '../components/ui';
import * as api from '../services/api';
import { APP, DOMAINS } from '../config/constants';

export default function Settings({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">System-Status, User Management, Konfiguration</p>
      </div>
      <SystemStatus />
      {user?.role === 'admin' && <UserManagement />}
      <DomainInfo />
      <ApiInfo />
    </div>
  );
}

function SystemStatus() {
  const [health, setHealth] = useState(null);
  useEffect(() => { api.health().then(setHealth).catch(() => null); }, []);

  return (
    <Card title="System">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-500">Version</span><span className="text-white ml-3">{APP.version}</span></div>
        <div><span className="text-gray-500">App</span><span className="text-white ml-3">{APP.name}</span></div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-gray-500">Backend</span>
          <span className="text-gray-400 text-xs">{health?.version || 'offline'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${health?.database === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-gray-500">Datenbank</span>
          <span className="text-gray-400 text-xs">{health?.database || 'offline'}</span>
        </div>
      </div>
    </Card>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: 'viewer' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = useCallback(async () => {
    try { setUsers(await api.authUsers()); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) return;
    setError(null);
    try {
      await api.authCreateUser(newUser.email, newUser.name, newUser.password, newUser.role);
      setNewUser({ email: '', name: '', password: '', role: 'viewer' });
      setShowAdd(false);
      await load();
    } catch (e) { setError(e.message); }
  };

  const updateUser = async (id) => {
    setError(null);
    try {
      const data = { ...editData };
      if (!data.password) delete data.password;
      await api.authUpdateUser(id, data);
      setEditingId(null);
      setEditData({});
      await load();
    } catch (e) { setError(e.message); }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      await api.authUpdateUser(id, { active: !currentActive });
      await load();
    } catch (e) { setError(e.message); }
  };

  const roleColors = { admin: 'red', team: 'blue', viewer: 'gray' };
  const roleLabels = { admin: 'Admin', team: 'Team', viewer: 'Viewer' };

  if (loading) return <Card title="User Management"><Spinner /></Card>;

  return (
    <Card title="User Management" actions={
      <Btn size="sm" variant="secondary" onClick={() => setShowAdd(!showAdd)}>+ User</Btn>
    }>
      <ErrorBox message={error} onDismiss={() => setError(null)} />

      {/* Add User Form */}
      {showAdd && (
        <div className="bg-gray-800/30 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" value={newUser.email} onChange={v => setNewUser(p => ({ ...p, email: v }))} placeholder="name@email.de" />
            <Input label="Name" value={newUser.name} onChange={v => setNewUser(p => ({ ...p, name: v }))} placeholder="Vorname" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Passwort" value={newUser.password} onChange={v => setNewUser(p => ({ ...p, password: v }))} type="password" placeholder="Min. 6 Zeichen" />
            <Select label="Rolle" value={newUser.role} onChange={v => setNewUser(p => ({ ...p, role: v }))}
              options={[{ value: 'admin', label: 'Admin — Vollzugriff' }, { value: 'team', label: 'Team — Analyse & Content' }, { value: 'viewer', label: 'Viewer — Nur lesen' }]} />
          </div>
          <div className="flex gap-2">
            <Btn size="sm" onClick={createUser}>Erstellen</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Abbrechen</Btn>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="space-y-1">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-800/20 transition-colors">
            {editingId === u.id ? (
              <div className="flex-1 grid grid-cols-4 gap-2 items-end mr-3">
                <Input value={editData.name ?? u.name} onChange={v => setEditData(p => ({ ...p, name: v }))} placeholder="Name" />
                <Select value={editData.role ?? u.role} onChange={v => setEditData(p => ({ ...p, role: v }))}
                  options={[{ value: 'admin', label: 'Admin' }, { value: 'team', label: 'Team' }, { value: 'viewer', label: 'Viewer' }]} />
                <Input value={editData.password || ''} onChange={v => setEditData(p => ({ ...p, password: v }))} type="password" placeholder="Neues PW (leer = unverändert)" />
                <div className="flex gap-1">
                  <Btn size="xs" onClick={() => updateUser(u.id)}>✓</Btn>
                  <Btn size="xs" variant="ghost" onClick={() => { setEditingId(null); setEditData({}); }}>✕</Btn>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <div>
                    <span className="text-white text-sm font-medium">{u.name}</span>
                    <span className="text-gray-600 text-xs ml-2">{u.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={roleColors[u.role]}>{roleLabels[u.role] || u.role}</Badge>
                  {u.lastLogin && (
                    <span className="text-gray-700 text-[10px]">
                      {new Date(u.lastLogin).toLocaleDateString('de', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <Btn size="xs" variant="ghost" onClick={() => { setEditingId(u.id); setEditData({}); }}>✎</Btn>
                  <Btn size="xs" variant="ghost" onClick={() => toggleActive(u.id, u.active)}>
                    {u.active ? '🔒' : '🔓'}
                  </Btn>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DomainInfo() {
  return (
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
  );
}

function ApiInfo() {
  return (
    <Card title="API-Keys">
      <p className="text-gray-400 text-sm leading-relaxed">
        Alle API-Keys (DataForSEO, OpenAI, Google) sind serverseitig in der <code className="text-blue-400">.env</code> Datei
        auf dem VPS konfiguriert. Keine Credentials im Browser.
      </p>
    </Card>
  );
}
