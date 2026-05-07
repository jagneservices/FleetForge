import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Phone, Mail, X } from 'lucide-react';
import api from '../../lib/api';
import { initials } from '../../lib/format';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/drivers');
      setDrivers(r.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/drivers', { name: form.name, phone: form.phone || null, email: form.email || null });
      setForm({ name: '', phone: '', email: '' });
      setShow(false);
      await load();
    } finally { setBusy(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Remove this driver?')) return;
    await api.delete(`/drivers/${id}`);
    setDrivers((arr) => arr.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500">{drivers.length} driver{drivers.length === 1 ? '' : 's'}</p>
        </div>
        <button
          onClick={() => setShow(true)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
        >
          <Plus className="h-4 w-4" /> Add driver
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : drivers.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="text-gray-700 font-semibold">No drivers yet</div>
          <div className="text-sm text-gray-500 mt-1">Add your first driver to start dispatching loads.</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#0a0a0a', color: '#d4a23a' }}
                  >
                    {initials(d.name)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{d.name}</div>
                    <div className="text-xs text-gray-500">Driver</div>
                  </div>
                </div>
                <button onClick={() => del(d.id)} className="text-gray-400 hover:text-rose-600 p-1"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                {d.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" />{d.phone}</div>}
                {d.email && <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" />{d.email}</div>}
                {!d.phone && !d.email && <div className="text-gray-400 text-xs">No contact info</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Driver modal (simple inline) */}
      {show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Add driver</h2>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-1 block">Name <span className="text-rose-500">*</span></label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]" placeholder="e.g. James Miller" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShow(false)} className="px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button>
                <button disabled={busy} type="submit" className="rounded-md px-4 py-2 font-bold text-sm disabled:opacity-50" style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
