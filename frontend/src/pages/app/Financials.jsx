import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { money, moneyExact } from '../../lib/format';

const Financials = () => {
  const [loads, setLoads] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [l, e] = await Promise.all([api.get('/loads'), api.get('/expenses')]);
      setLoads(l.data);
      setExpenses(e.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const expByLoad = useMemo(() => {
    const m = {};
    for (const e of expenses) {
      if (!e.load_id) continue;
      m[e.load_id] = (m[e.load_id] || 0) + (e.amount || 0);
    }
    return m;
  }, [expenses]);

  const expByCategory = useMemo(() => {
    const m = {};
    for (const e of expenses) {
      m[e.category] = (m[e.category] || 0) + (e.amount || 0);
    }
    return m;
  }, [expenses]);

  const revenue = loads.reduce((s, l) => s + (l.rate || 0), 0);
  const totalExp = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const profit = revenue - totalExp;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Financials</h1>
        <p className="text-sm text-gray-500">Revenue, expenses, and profit per load.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4" style={{ color: '#d4a23a' }} /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Revenue</span></div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{moneyExact(revenue)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-rose-600" /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Expenses</span></div>
          <div className="text-2xl font-extrabold text-gray-900 mt-2">{moneyExact(totalExp)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-600" /><span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Profit</span></div>
          <div className="text-2xl font-extrabold mt-2" style={{ color: profit >= 0 ? '#0a0a0a' : '#e11d48' }}>{moneyExact(profit)}</div>
        </div>
      </div>

      {/* Expenses by category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">Expenses by category</h2>
        {Object.keys(expByCategory).length === 0 ? (
          <div className="text-sm text-gray-500 py-4">No expenses yet.</div>
        ) : (
          <div className="space-y-2">
            {Object.entries(expByCategory).map(([cat, amt]) => {
              const pct = totalExp > 0 ? (amt / totalExp) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="font-bold text-gray-900">{moneyExact(amt)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, backgroundColor: '#d4a23a' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Per-load profit */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 font-bold text-gray-900">Profit per load</div>
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : loads.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No loads yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-semibold px-4 py-2.5">#</th>
                  <th className="text-left font-semibold px-4 py-2.5">Lane</th>
                  <th className="text-right font-semibold px-4 py-2.5">Revenue</th>
                  <th className="text-right font-semibold px-4 py-2.5">Expenses</th>
                  <th className="text-right font-semibold px-4 py-2.5">Profit</th>
                  <th className="text-right font-semibold px-4 py-2.5">$/mi</th>
                  <th className="px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loads.map((l) => {
                  const exp = expByLoad[l.id] || 0;
                  const p = (l.rate || 0) - exp;
                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-600">{l.load_number}</td>
                      <td className="px-4 py-3 text-gray-900">{l.pickup} → {l.dropoff}</td>
                      <td className="px-4 py-3 text-right">{money(l.rate)}</td>
                      <td className="px-4 py-3 text-right text-rose-600">{money(exp)}</td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: p >= 0 ? '#0a0a0a' : '#e11d48' }}>{money(p)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{l.miles ? money(l.rate / l.miles) : '—'}</td>
                      <td className="px-2 py-3"><Link to={`/app/loads/${l.id}`} className="text-gray-400 hover:text-[#d4a23a]"><ArrowRight className="h-4 w-4" /></Link></td>
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

export default Financials;
