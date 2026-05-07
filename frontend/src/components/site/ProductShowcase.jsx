import React from 'react';
import { Smartphone, Wifi, Battery, Signal, Check } from 'lucide-react';

const tmsBullets = [
  'Dispatch with one click',
  'Two-click invoicing &amp; payment tracking',
  'Per-mile profitability stats',
  'Driver settlements automated',
];

const eldBullets = [
  'Plug &amp; play installation in minutes',
  'Hours-of-service automation',
  'Upload receipts &amp; BOLs from the road',
  'Fully FMCSA-compliant',
];

const ProductShowcase = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#d4a23a' }}>
            One platform
          </div>
          <h2 className="font-extrabold text-gray-900 leading-tight text-[34px] sm:text-[42px] lg:text-[50px]">
            Office &amp; cab, <span style={{ color: '#d4a23a' }}>connected</span>.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your TMS and ELD share data automatically — so you stop entering things twice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* TMS Card */}
          <div className="relative rounded-2xl p-8 lg:p-10" style={{ backgroundColor: '#0a0a0a' }}>
            <div
              className="inline-block px-3 py-1 rounded-md text-xs font-bold mb-5"
              style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
            >
              TMS · Back office
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-3">Trucking Software</h3>
            <p className="text-gray-400 mb-6">Run dispatch, invoicing, and reporting from anywhere.</p>
            <ul className="space-y-3 mb-8">
              {tmsBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#d4a23a' }} />
                  <span className="text-gray-200" dangerouslySetInnerHTML={{ __html: b }} />
                </li>
              ))}
            </ul>
            {/* Browser mock */}
            <div className="rounded-lg overflow-hidden border border-white/10 bg-white">
              <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[11px] text-gray-600 ml-2">FleetForge — Trips</span>
              </div>
              <div className="p-3 text-[11px]">
                <table className="w-full text-left">
                  <thead className="text-gray-600">
                    <tr>
                      <th className="py-1">Trip</th>
                      <th className="py-1">Lane</th>
                      <th className="py-1">Driver</th>
                      <th className="py-1 text-right">$/mi</th>
                      <th className="py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {[
                      ['TR-2301', 'DAL → ATL', 'J. Miller', '$3.18', 'Delivered', 'bg-green-100 text-green-700'],
                      ['TR-2302', 'CHI → STL', 'A. Reyes', '$2.94', 'In Transit', 'bg-yellow-100 text-yellow-800'],
                      ['TR-2303', 'PHX → LAX', 'D. Smith', '$3.41', 'Delivered', 'bg-green-100 text-green-700'],
                      ['TR-2304', 'NYC → BOS', 'L. Park', '$2.65', 'Open', 'bg-gray-100 text-gray-700'],
                    ].map((r) => (
                      <tr key={r[0]} className="border-t">
                        <td className="py-1.5 font-semibold">{r[0]}</td>
                        <td className="py-1.5">{r[1]}</td>
                        <td className="py-1.5">{r[2]}</td>
                        <td className="py-1.5 text-right font-bold" style={{ color: '#0a0a0a' }}>{r[3]}</td>
                        <td className="py-1.5"><span className={`px-1.5 py-0.5 rounded ${r[5]}`}>{r[4]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ELD Card */}
          <div
            className="relative rounded-2xl p-8 lg:p-10 border"
            style={{ backgroundColor: '#fdf9f0', borderColor: '#d4a23a' }}
          >
            <div
              className="inline-block px-3 py-1 rounded-md text-xs font-bold mb-5"
              style={{ backgroundColor: '#0a0a0a', color: '#d4a23a' }}
            >
              ELD · In the cab
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Electronic Logbook</h3>
            <p className="text-gray-700 mb-6">A driver app that does the paperwork for you.</p>
            <ul className="space-y-3 mb-8">
              {eldBullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#0a0a0a' }} />
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: b }} />
                </li>
              ))}
            </ul>
            {/* Phone mock */}
            <div className="flex justify-center">
              <div className="w-[220px] h-[420px] rounded-[32px] bg-gray-900 p-2.5 shadow-2xl">
                <div className="w-full h-full rounded-[24px] bg-white overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 text-[10px]">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <Signal className="h-3 w-3" />
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="px-4 py-3 text-white" style={{ backgroundColor: '#0a0a0a' }}>
                    <div className="text-[10px]" style={{ color: '#d4a23a' }}>FleetForge ELD</div>
                    <div className="font-bold text-sm">Driver Dashboard</div>
                  </div>
                  <div className="p-3 space-y-2.5 text-xs flex-1">
                    <div className="rounded-lg p-2" style={{ backgroundColor: 'rgba(212,162,58,0.15)', borderLeft: '3px solid #d4a23a' }}>
                      <div className="font-bold" style={{ color: '#0a0a0a' }}>ON DUTY — Driving</div>
                      <div className="text-gray-600">Available: 7h 23m</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <div className="font-semibold text-gray-800">Current Trip</div>
                      <div className="text-gray-600 text-[11px]">TR-2305 • DAL → ATL</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button className="py-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: '#0a0a0a', color: '#d4a23a' }}>Logs</button>
                      <button className="py-1.5 rounded text-[10px] font-semibold" style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}>Receipt</button>
                      <button className="py-1.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">DVIR</button>
                      <button className="py-1.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">Status</button>
                    </div>
                  </div>
                  <div className="flex justify-center py-1.5 border-t">
                    <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
