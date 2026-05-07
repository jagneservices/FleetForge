import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { complianceStyle } from '../../lib/format';

const Compliance = () => {
  const [items, setItems] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ item_type: 'DQ File', entity_name: '', entity_id: '', expires_on: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [c, d] = await Promise.all([api.get('/compliance'), api.get('/drivers')]);
      setItems(c.data);
      setDrivers(d.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/compliance', {
        item_type: form.item_type,
        entity_name: form.entity_name,
        entity_id: form.entity_id || null,
        expires_on: form.expires_on || null,
        status: form.expires_on ? 'Complete' : 'Missing',
      });
      setForm({ item_type: 'DQ File', entity_name: '', entity_id: '', expires_on: '' });
      setShow(false);
      await load();
    } finally { setBusy(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/compliance/${id}`);
    setItems((arr) => arr.filter((x) => x.id !== id));
  };

  const counts = items.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, { Complete: 0, Expiring: 0, Missing: 0 });

  const groups = ['DQ File', 'Insurance', 'Vehicle Inspection'];

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Compliance</h1>
          <p className="text-sm text-gray-500">Track DQ files, insurance, and inspections.</p>
        </div>
        <button
          onClick={() => setShow(true)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
        >
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Complete</span></div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{counts.Complete}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Expiring</span></div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{counts.Expiring}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-rose-600" /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Missing / Expired</span></div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{counts.Missing}</div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => {
            const list = items.filter((i) => i.item_type === g);
            return (
              <section key={g} className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-3 border-b border-gray-100 font-bold text-gray-900">{g}</div>
                {list.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-gray-500">No {g.toLowerCase()} items tracked.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {list.map((i) => {
                      const s = complianceStyle(i.status);
                      return (
                        <li key={i.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{i.entity_name}</div>
                            <div className="text-xs text-gray-500">
                              {i.expires_on ? `Expires ${i.expires_on}` : 'No expiration on file'}
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {i.status}
                          </span>
                          <button onClick={() => del(i.id)} className="text-gray-400 hover:text-rose-600 p-1 ml-1"><Trash2 className="h-4 w-4" /></button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      {show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Add compliance item</h2>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Type</label>
                <select value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white">
                  {groups.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              {form.item_type === 'DQ File' ? (
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">Driver</label>
                  <select required value={form.entity_id} onChange={(e) => {
                    const d = drivers.find((dr) => dr.id === e.target.value);
                    setForm({ ...form, entity_id: e.target.value, entity_name: d?.name || '' });
                  }} className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white">
                    <option value="">— Select driver —</option>
                    {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">Name <span className="text-rose-500">*</span></label>
                  <input required value={form.entity_name} onChange={(e) => setForm({ ...form, entity_name: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300" placeholder={form.item_type === 'Insurance' ? 'Cargo / General Liability' : 'Truck #101'} />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Expires on</label>
                <input type="date" value={form.expires_on} onChange={(e) => setForm({ ...form, expires_on: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button>
                <button disabled={busy} type="submit" className="rounded-md px-4 py-2 font-bold text-sm disabled:opacity-50" style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
