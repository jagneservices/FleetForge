import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, DollarSign, ShieldCheck, FileText, Users, ArrowRight, Plus, Upload, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { money, statusStyle } from '../../lib/format';

const StatCard = ({ label, value, icon: Icon, accent, hint }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: accent || 'rgba(212,162,58,0.12)' }}
      >
        <Icon className="h-4.5 w-4.5" style={{ color: '#d4a23a' }} />
      </div>
    </div>
    <div className="mt-3 text-2xl font-extrabold text-gray-900">{value}</div>
    {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, l] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/loads'),
      ]);
      setStats(s.data);
      setRecent((l.data || []).slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const seed = async () => {
    setSeeding(true);
    try {
      await api.post('/dashboard/seed');
      await load();
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  const empty = (stats?.loads_total || 0) === 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Your operation at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/loads/new"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
          >
            <Plus className="h-4 w-4" /> New load
          </Link>
          <Link
            to="/app/documents"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-semibold text-sm border border-gray-300 text-gray-800 hover:border-[#d4a23a] hover:text-[#d4a23a]"
          >
            <Upload className="h-4 w-4" /> Upload document
          </Link>
        </div>
      </div>

      {empty && (
        <div className="bg-gradient-to-br from-[#fdf3d6] to-white border border-[#d4a23a]/40 rounded-xl p-6 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d4a23a' }}>
            <Sparkles className="h-5 w-5" style={{ color: '#0a0a0a' }} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900">Welcome to FleetForge</div>
            <div className="text-sm text-gray-700">Load demo data to see the workflow in action, or jump straight in.</div>
          </div>
          <button
            onClick={seed}
            disabled={seeding}
            className="rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: '#0a0a0a', color: '#d4a23a' }}
          >
            {seeding ? 'Loading...' : 'Load demo data'}
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={money(stats.total_revenue)} icon={DollarSign} hint={`Profit ${money(stats.profit)}`} />
        <StatCard label="Active loads" value={stats.loads_active} icon={Truck} hint={`${stats.loads_total} total`} />
        <StatCard label="Drivers" value={stats.drivers_count} icon={Users} />
        <StatCard label="Compliance alerts" value={stats.compliance_alerts} icon={ShieldCheck} hint={stats.compliance_alerts > 0 ? 'Action needed' : 'All clear'} />
      </div>

      {/* Pipeline */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Pipeline</h2>
          <Link to="/app/loads" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: '#d4a23a' }}>
            View all loads <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(stats.by_status).map(([k, v]) => {
            const s = statusStyle(k);
            return (
              <div key={k} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-gray-600 font-medium">{k}</span>
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">{v}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent loads */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent loads</h2>
          <Link to="/app/loads" className="text-sm font-semibold" style={{ color: '#d4a23a' }}>See all</Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <div>No loads yet. Create your first load.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((l) => {
              const s = statusStyle(l.status);
              return (
                <Link
                  key={l.id}
                  to={`/app/loads/${l.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-mono text-xs text-gray-500 w-16">{l.load_number}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {l.pickup} <span className="text-gray-400">→</span> {l.dropoff}
                    </div>
                    <div className="text-xs text-gray-500">{l.customer || 'No customer'}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-gray-900">{money(l.rate)}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {l.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
