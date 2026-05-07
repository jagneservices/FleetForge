import React, { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Trash2, X, Loader2, Sparkles, Search } from 'lucide-react';
import api from '../../lib/api';

const typeStyle = (t) => {
  switch (t) {
    case 'Rate Confirmation': return 'bg-amber-100 text-amber-900';
    case 'BOL': return 'bg-blue-100 text-blue-800';
    case 'Receipt': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const Documents = () => {
  const fileRef = useRef(null);
  const [docs, setDocs] = useState([]);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAttach, setShowAttach] = useState(false);
  const [pending, setPending] = useState(null); // {file, preview}
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, l] = await Promise.all([api.get('/documents'), api.get('/loads')]);
      setDocs(d.data);
      setLoads(l.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const onPick = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/documents/parse', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPending({ file, preview: data });
      setShowAttach(true);
    } finally { setBusy(false); }
  };

  const finalize = async (loadId, createNew) => {
    if (!pending) return;
    setBusy(true);
    try {
      let target = loadId;
      if (createNew) {
        const ex = pending.preview.extracted || {};
        const { data: newLoad } = await api.post('/loads', {
          pickup: ex.pickup || 'Pickup TBD',
          dropoff: ex.dropoff || 'Dropoff TBD',
          rate: ex.rate || null,
          customer: ex.customer || null,
          miles: ex.miles || null,
        });
        target = newLoad.id;
      }
      const fd = new FormData();
      fd.append('file', pending.file);
      if (target) fd.append('load_id', target);
      fd.append('doc_type', pending.preview.doc_type);
      await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetchAll();
      setShowAttach(false);
      setPending(null);
    } finally { setBusy(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await api.delete(`/documents/${id}`);
    setDocs((arr) => arr.filter((d) => d.id !== id));
  };

  const loadMap = Object.fromEntries(loads.map((l) => [l.id, l]));
  const filtered = docs.filter((d) => {
    if (!q) return true;
    const l = loadMap[d.load_id];
    const hay = `${d.filename} ${d.doc_type} ${l?.load_number || ''} ${l?.pickup || ''} ${l?.dropoff || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500">{docs.length} document{docs.length === 1 ? '' : 's'}</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="application/pdf,image/*" capture="environment" className="hidden" onChange={(e) => onPick(e.target.files?.[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload document
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 outline-none focus:border-[#d4a23a]" placeholder="Search documents..." />
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <div className="text-gray-700 font-semibold">No documents</div>
            <div className="text-sm text-gray-500 mt-1">Upload a rate confirmation, BOL, or receipt to get started.</div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((d) => {
              const l = loadMap[d.load_id];
              return (
                <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{d.filename}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${typeStyle(d.doc_type)}`}>{d.doc_type}</span>
                      <span>{(d.size / 1024).toFixed(0)} KB</span>
                      {l && <a href={`/app/loads/${l.id}`} className="underline hover:text-[#d4a23a]">{l.load_number} · {l.pickup} → {l.dropoff}</a>}
                      {!l && <span className="text-amber-700">Unattached</span>}
                    </div>
                  </div>
                  <button onClick={() => del(d.id)} className="text-gray-400 hover:text-rose-600 p-1"><Trash2 className="h-4 w-4" /></button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Attach modal */}
      {showAttach && pending && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => !busy && setShowAttach(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Attach document</h2>
              <button onClick={() => setShowAttach(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Sparkles className="h-4 w-4 text-amber-700" />
                <div className="text-sm">
                  <div className="font-bold text-amber-900">{pending.file.name}</div>
                  <div className="text-amber-800 text-xs">Detected as {pending.preview.doc_type}</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 font-medium">Where should this document go?</p>
              {pending.preview.doc_type === 'Rate Confirmation' && (
                <button
                  disabled={busy}
                  onClick={() => finalize(null, true)}
                  className="w-full text-left rounded-lg border-2 border-[#d4a23a] bg-[#fdf3d6] p-4 hover:bg-[#fce9b4] disabled:opacity-50"
                >
                  <div className="font-bold text-gray-900">Create new load from this rate confirmation</div>
                  <div className="text-xs text-gray-700 mt-0.5">{pending.preview.extracted?.pickup} → {pending.preview.extracted?.dropoff} · ${pending.preview.extracted?.rate}</div>
                </button>
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Or attach to existing load</div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {loads.length === 0 && <div className="text-sm text-gray-500">No loads yet.</div>}
                  {loads.map((l) => (
                    <button
                      key={l.id}
                      disabled={busy}
                      onClick={() => finalize(l.id, false)}
                      className="w-full text-left rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-mono text-xs text-gray-500">{l.load_number}</div>
                          <div className="text-sm font-medium text-gray-900">{l.pickup} → {l.dropoff}</div>
                        </div>
                        <div className="text-xs text-gray-500">{l.status}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={busy}
                onClick={() => finalize(null, false)}
                className="w-full text-center text-sm font-semibold py-2 rounded-md border border-gray-300 hover:border-gray-400 disabled:opacity-50"
              >
                Save without attaching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
