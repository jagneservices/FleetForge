import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, DollarSign, Upload, FileText, Trash2, Plus, ChevronRight, Truck, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { money, moneyExact, statusStyle, STATUSES } from '../../lib/format';

const LoadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [load, setLoad] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [docs, setDocs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExp, setShowAddExp] = useState(false);
  const [exp, setExp] = useState({ category: 'Fuel', amount: '', description: '' });
  const [busy, setBusy] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [l, d, doc, e] = await Promise.all([
        api.get(`/loads/${id}`),
        api.get('/drivers'),
        api.get('/documents', { params: { load_id: id } }),
        api.get('/expenses', { params: { load_id: id } }),
      ]);
      setLoad(l.data);
      setDrivers(d.data);
      setDocs(doc.data);
      setExpenses(e.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [id]);

  if (loading || !load) return <div className="p-6 text-gray-500">Loading...</div>;

  const driver = drivers.find((d) => d.id === load.driver_id);
  const totalExp = expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const profit = (load.rate || 0) - totalExp;
  const s = statusStyle(load.status);

  const setStatus = async (status) => {
    setBusy(true);
    try {
      const { data } = await api.patch(`/loads/${id}/status`, { status });
      setLoad(data);
    } finally { setBusy(false); }
  };

  const assign = async (driver_id) => {
    setBusy(true);
    try {
      const { data } = await api.post(`/loads/${id}/assign`, { driver_id: driver_id || null });
      setLoad(data);
    } finally { setBusy(false); }
  };

  const onUpload = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('load_id', id);
    setBusy(true);
    try {
      await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const r = await api.get('/documents', { params: { load_id: id } });
      setDocs(r.data);
    } finally { setBusy(false); }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!exp.amount) return;
    setBusy(true);
    try {
      await api.post('/expenses', {
        load_id: id,
        category: exp.category,
        amount: parseFloat(exp.amount),
        description: exp.description || null,
      });
      const r = await api.get('/expenses', { params: { load_id: id } });
      setExpenses(r.data);
      setExp({ category: 'Fuel', amount: '', description: '' });
      setShowAddExp(false);
    } finally { setBusy(false); }
  };

  const delExpense = async (eid) => {
    await api.delete(`/expenses/${eid}`);
    setExpenses((arr) => arr.filter((x) => x.id !== eid));
  };

  const delDoc = async (did) => {
    await api.delete(`/documents/${did}`);
    setDocs((arr) => arr.filter((x) => x.id !== did));
  };

  const delLoad = async () => {
    if (!window.confirm(`Delete ${load.load_number}? This cannot be undone.`)) return;
    await api.delete(`/loads/${id}`);
    navigate('/app/loads');
  };

  const nextStatusIdx = STATUSES.indexOf(load.status);
  const nextStatus = nextStatusIdx >= 0 && nextStatusIdx < STATUSES.length - 1 ? STATUSES[nextStatusIdx + 1] : null;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <Link to="/app/loads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3">
        <ArrowLeft className="h-4 w-4" /> Back to loads
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900">{load.load_number}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {load.status}
            </span>
          </div>
          <div className="text-gray-700 mt-1 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{load.pickup}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{load.dropoff}</span>
          </div>
          {load.customer && <div className="text-sm text-gray-500 mt-0.5">{load.customer}</div>}
        </div>
        <div className="flex gap-2">
          {nextStatus && (
            <button
              onClick={() => setStatus(nextStatus)}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
            >
              Mark {nextStatus} <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={delLoad}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-semibold text-sm border border-gray-300 text-gray-700 hover:border-rose-400 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {STATUSES.map((st, i) => {
            const idx = STATUSES.indexOf(load.status);
            const active = i === idx;
            const done = i < idx;
            return (
              <React.Fragment key={st}>
                <button
                  onClick={() => setStatus(st)}
                  disabled={busy}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    active
                      ? 'bg-[#0a0a0a] text-[#d4a23a]'
                      : done
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
                {i < STATUSES.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inline guidance */}
          {!load.driver_id && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-amber-900 font-semibold">Assign a driver to move this load forward.</span>{' '}
                <span className="text-amber-800">It will automatically move to <b>Dispatched</b>.</span>
              </div>
            </div>
          )}
          {docs.length === 0 && load.status !== 'Pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-blue-700 mt-0.5 shrink-0" />
              <span className="text-blue-900">Upload documents (BOL, receipts) to complete this load.</span>
            </div>
          )}

          {/* Documents */}
          <section className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Documents</h2>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept="application/pdf,image/*"
                onChange={(e) => onUpload(e.target.files?.[0])}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md border border-gray-300 hover:border-[#d4a23a] hover:text-[#d4a23a]"
              >
                <Upload className="h-3.5 w-3.5" /> Upload
              </button>
            </div>
            {docs.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No documents yet</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate text-sm">{d.filename}</div>
                      <div className="text-xs text-gray-500">{d.doc_type} · {(d.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button onClick={() => delDoc(d.id)} className="text-gray-400 hover:text-rose-600 p-1"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Expenses */}
          <section className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Expenses</h2>
              <button
                onClick={() => setShowAddExp((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md border border-gray-300 hover:border-[#d4a23a] hover:text-[#d4a23a]"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            {showAddExp && (
              <form onSubmit={addExpense} className="px-5 py-4 border-b border-gray-100 grid sm:grid-cols-4 gap-2">
                <select
                  value={exp.category}
                  onChange={(e) => setExp({ ...exp, category: e.target.value })}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm bg-white"
                >
                  {['Fuel', 'Tolls', 'Maintenance', 'Other'].map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={exp.amount}
                  onChange={(e) => setExp({ ...exp, amount: e.target.value })}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm"
                />
                <input
                  placeholder="Description (optional)"
                  value={exp.description}
                  onChange={(e) => setExp({ ...exp, description: e.target.value })}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md text-sm font-bold px-3 py-2"
                  style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
                >Save</button>
              </form>
            )}
            {expenses.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No expenses tracked</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {expenses.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 w-24">{e.category}</div>
                    <div className="flex-1 text-sm text-gray-700">{e.description || <span className="text-gray-400">No description</span>}</div>
                    <div className="font-bold text-gray-900">{moneyExact(e.amount)}</div>
                    <button onClick={() => delExpense(e.id)} className="text-gray-400 hover:text-rose-600 p-1"><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: summary */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3">Financials</h3>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-gray-600">Revenue</span>
              <span className="font-bold text-gray-900">{money(load.rate)}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5 border-t border-gray-100">
              <span className="text-gray-600">Expenses</span>
              <span className="font-bold text-gray-900">{money(totalExp)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-800">Profit</span>
              <span className="font-extrabold" style={{ color: profit >= 0 ? '#0a0a0a' : '#e11d48' }}>{money(profit)}</span>
            </div>
            {load.miles ? (
              <div className="text-xs text-gray-500 mt-2">
                {load.miles} mi · {money((load.rate || 0) / load.miles)}/mi
              </div>
            ) : null}
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><User className="h-4 w-4" /> Driver</h3>
            <select
              value={load.driver_id || ''}
              onChange={(e) => assign(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm bg-white"
            >
              <option value="">— Unassigned —</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {driver && (
              <div className="mt-3 text-sm text-gray-600">
                {driver.phone && <div>{driver.phone}</div>}
                {driver.email && <div>{driver.email}</div>}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Truck className="h-4 w-4" /> Details</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Pickup</span><span className="font-medium">{load.pickup}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Dropoff</span><span className="font-medium">{load.dropoff}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Rate</span><span className="font-medium">{money(load.rate)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Miles</span><span className="font-medium">{load.miles || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-medium">{load.customer || '—'}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoadDetail;
