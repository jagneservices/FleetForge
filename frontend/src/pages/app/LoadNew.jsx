import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, MapPin, FileText, Loader2, ArrowLeft, Sparkles, X } from 'lucide-react';
import api from '../../lib/api';

const LoadNew = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [drivers, setDrivers] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    rate: '',
    customer: '',
    miles: '',
    driver_id: '',
  });
  const [docFile, setDocFile] = useState(null);

  useEffect(() => {
    api.get('/drivers').then((r) => setDrivers(r.data));
  }, []);

  const onFile = async (file) => {
    if (!file) return;
    setDocFile(file);
    setParsing(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/documents/parse', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setParsed(data);
      const ex = data.extracted || {};
      setForm((f) => ({
        ...f,
        pickup: ex.pickup || f.pickup,
        dropoff: ex.dropoff || f.dropoff,
        rate: ex.rate ? String(ex.rate) : f.rate,
        customer: ex.customer || f.customer,
        miles: ex.miles ? String(ex.miles) : f.miles,
      }));
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Could not parse document');
    } finally {
      setParsing(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const payload = {
        pickup: form.pickup,
        dropoff: form.dropoff,
        rate: form.rate ? parseFloat(form.rate) : null,
        customer: form.customer || null,
        miles: form.miles ? parseFloat(form.miles) : null,
        driver_id: form.driver_id || null,
      };
      const { data: load } = await api.post('/loads', payload);

      // Attach the file if one was uploaded for parsing
      if (docFile) {
        const fd = new FormData();
        fd.append('file', docFile);
        fd.append('load_id', load.id);
        fd.append('doc_type', parsed?.doc_type || 'Rate Confirmation');
        try { await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); } catch { /* ignore */ }
      }

      navigate(`/app/loads/${load.id}`);
    } catch (e2) {
      setErr(e2?.response?.data?.detail || 'Could not create load');
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = form.pickup && form.dropoff;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <Link to="/app/loads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to loads
      </Link>
      <h1 className="text-2xl font-extrabold text-gray-900">New load</h1>
      <p className="text-sm text-gray-500">Upload a rate confirmation to auto-fill, or enter the details below.</p>

      {/* Upload box */}
      <div
        className={`mt-6 rounded-xl border-2 border-dashed p-5 transition-colors ${
          parsed ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 bg-white hover:border-[#d4a23a]'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        {!parsed ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(212,162,58,0.12)' }}
            >
              {parsing ? (
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#d4a23a' }} />
              ) : (
                <Upload className="h-5 w-5" style={{ color: '#d4a23a' }} />
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900">Upload rate confirmation</div>
              <div className="text-sm text-gray-500">PDF or photo. We&rsquo;ll auto-fill what we find.</div>
            </div>
          </button>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-emerald-900">Auto-filled from {docFile?.name}</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Detected: {parsed.doc_type}. Review and adjust below.
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setParsed(null); setDocFile(null); }}
              className="text-emerald-700 hover:text-emerald-900 p-1"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="mt-6 space-y-4 bg-white rounded-xl border border-gray-200 p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Pickup <span className="text-rose-500">*</span>
            </label>
            <input
              required
              value={form.pickup}
              onChange={(e) => setForm({ ...form, pickup: e.target.value })}
              placeholder="City, State"
              className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Dropoff <span className="text-rose-500">*</span>
            </label>
            <input
              required
              value={form.dropoff}
              onChange={(e) => setForm({ ...form, dropoff: e.target.value })}
              placeholder="City, State"
              className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-1 block">Rate <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-1 block">Miles <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="number"
              value={form.miles}
              onChange={(e) => setForm({ ...form, miles: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-1 block">Customer <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              placeholder="Broker / shipper"
              className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-1 block">Driver <span className="text-gray-400 font-normal">(optional — assign now or later)</span></label>
          <select
            value={form.driver_id}
            onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a] bg-white"
          >
            <option value="">— Unassigned (saves as Pending) —</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600 flex items-start gap-2">
          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Tip: assign a driver now and we&rsquo;ll dispatch the load automatically. Otherwise it&rsquo;s saved as <b>Pending</b>.</span>
        </div>

        {err && <div className="text-sm text-rose-600">{err}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <Link to="/app/loads" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900">Cancel</Link>
          <button
            type="submit"
            disabled={!canSubmit || busy}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2 font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Save load
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadNew;
