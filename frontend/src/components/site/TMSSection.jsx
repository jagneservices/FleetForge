import React from 'react';
import { tmsFeatures } from '../../mock';

const TMSSection = () => {
  return (
    <section id="tms" className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <h2 className="text-center font-extrabold text-gray-900 text-[32px] sm:text-[42px] lg:text-[52px]">
          Trucking Software (TMS)
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          {['Organize', 'Streamline', 'Maximize'].map((w) => (
            <div key={w} className="text-xl lg:text-2xl font-bold text-gray-800">
              {w}
            </div>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            {tmsFeatures.map((f) => (
              <div key={f.title} className="text-gray-800">
                <span className="font-bold" style={{ color: '#1f3a8a' }}>{f.title}</span>{' '}
                <span className="text-gray-700">– {f.desc}</span>
              </div>
            ))}
          </div>

          {/* TMS dashboard mock */}
          <div className="rounded-lg shadow-xl border border-gray-200 overflow-hidden bg-white">
            <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-xs text-gray-600">TruckingOffice TMS – Trips List</div>
            </div>
            <div className="p-3 text-[11px]">
              <div className="flex gap-2 mb-2">
                <div className="px-2 py-1 bg-gray-200 rounded text-gray-700">All</div>
                <div className="px-2 py-1 bg-yellow-300 rounded">In Transit</div>
                <div className="px-2 py-1 bg-green-400 text-white rounded">Delivered</div>
                <div className="px-2 py-1 bg-red-400 text-white rounded">Open</div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-1.5">#</th><th className="p-1.5">Trip</th><th className="p-1.5">Pickup</th><th className="p-1.5">Delivery</th><th className="p-1.5">Driver</th><th className="p-1.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { c: 'bg-yellow-100', s: 'In Transit', sc: 'bg-yellow-300' },
                    { c: 'bg-green-100', s: 'Delivered', sc: 'bg-green-400 text-white' },
                    { c: 'bg-yellow-100', s: 'In Transit', sc: 'bg-yellow-300' },
                    { c: 'bg-green-100', s: 'Delivered', sc: 'bg-green-400 text-white' },
                    { c: 'bg-red-100', s: 'Open', sc: 'bg-red-400 text-white' },
                    { c: 'bg-yellow-100', s: 'In Transit', sc: 'bg-yellow-300' },
                    { c: 'bg-green-100', s: 'Delivered', sc: 'bg-green-400 text-white' },
                  ].map((r, i) => (
                    <tr key={i} className={r.c}>
                      <td className="p-1.5">{1001 + i}</td>
                      <td className="p-1.5">TR-{2300 + i}</td>
                      <td className="p-1.5">Dallas, TX</td>
                      <td className="p-1.5">Atlanta, GA</td>
                      <td className="p-1.5">J. Miller</td>
                      <td className="p-1.5"><span className={`px-1.5 py-0.5 rounded ${r.sc}`}>{r.s}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TMSSection;
