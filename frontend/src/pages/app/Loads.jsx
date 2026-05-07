import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../../lib/api';
import { money, statusStyle, STATUSES } from '../../lib/format';

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [l, d] = await Promise.all([api.get('/loads'), api.get('/drivers')]);
      setLoads(l.data);
      setDrivers(d.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const driverMap = useMemo(() => Object.fromEntries(drivers.map((d) => [d.id, d.name])), [drivers]);

  const filtered = loads.filter((l) => {
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    if (!q) return true;
    const hay = `${l.load_number} ${l.pickup} ${l.dropoff} ${l.customer || ''} ${driverMap[l.driver_id] || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Loads</h1>
          <p className="text-sm text-gray-500">{loads.length} total · {loads.filter((x) => ['Pending','Dispatched','In Transit'].includes(x.status)).length} active</p>
        </div>
        <Link
          to="/app/loads/new"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
        >
          <Plus className="h-4 w-4" /> New load
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by load #, lane, customer, driver..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400" />
            {['All', ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  statusFilter === s
                    ? 'bg-[#0a0a0a] text-[#d4a23a]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-700 font-semibold">No loads found</div>
            <div className="text-sm text-gray-500 mt-1">Try clearing the filters or create a new load.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">#</th>
                  <th className="text-left font-semibold px-4 py-2.5">Lane</th>
                  <th className="text-left font-semibold px-4 py-2.5">Customer</th>
                  <th className="text-left font-semibold px-4 py-2.5">Driver</th>
                  <th className="text-right font-semibold px-4 py-2.5">Rate</th>
                  <th className="text-left font-semibold px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l) => {
                  const s = statusStyle(l.status);
                  return (
                    <tr key={l.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = `/app/loads/${l.id}`)}>
                      <td className="px-4 py-3 font-mono text-gray-600">{l.load_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{l.pickup}</div>
                        <div className="text-xs text-gray-500">→ {l.dropoff}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{l.customer || <span className="text-gray-400">—</span>}</td>
                      <td className="px-4 py-3 text-gray-700">{driverMap[l.driver_id] || <span className="text-gray-400">Unassigned</span>}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{money(l.rate)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loads;
