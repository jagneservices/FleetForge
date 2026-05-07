import React from 'react';
import { eldFeatures } from '../../mock';
import { HeroButton } from './Hero';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

const ELDSection = () => {
  return (
    <section id="eld" className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <h2 className="text-center font-extrabold text-gray-900 text-[28px] sm:text-[36px] lg:text-[44px]">
          Electronic Logbook (ELD)
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          {['Compliant', 'Simple', 'Integrated'].map((w) => (
            <div key={w} className="text-xl lg:text-2xl font-bold text-gray-800">
              {w}
            </div>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone mock */}
          <div className="flex justify-center">
            <div className="relative w-[260px] h-[520px] rounded-[40px] bg-gray-900 p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
              <div className="w-full h-full rounded-[30px] bg-white overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-[10px]">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <Battery className="h-3 w-3" />
                  </div>
                </div>
                <div className="px-4 py-3 text-white" style={{ backgroundColor: '#1f3a8a' }}>
                  <div className="text-xs opacity-80">TruckingOffice ELD</div>
                  <div className="font-bold">Driver Dashboard</div>
                </div>
                <div className="p-4 space-y-3 text-xs flex-1">
                  <div className="bg-green-100 border border-green-300 p-2 rounded">
                    <div className="font-bold text-green-800">ON DUTY – Driving</div>
                    <div className="text-gray-700">Available: 7h 23m</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border">
                    <div className="font-semibold">Current Trip</div>
                    <div className="text-gray-600">TR-2305 • Dallas → Atlanta</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="bg-blue-600 text-white py-2 rounded text-xs">Logs</button>
                    <button className="bg-red-600 text-white py-2 rounded text-xs">Receipts</button>
                    <button className="bg-green-600 text-white py-2 rounded text-xs">DVIR</button>
                    <button className="bg-gray-600 text-white py-2 rounded text-xs">Status</button>
                  </div>
                </div>
                <div className="flex justify-center py-2 border-t">
                  <Smartphone className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {eldFeatures.map((f) => (
              <div key={f.title} className="text-gray-800">
                <span className="font-bold" style={{ color: '#1f3a8a' }}>{f.title}</span>{' '}
                <span className="text-gray-700">– {f.desc}</span>
              </div>
            ))}
            <p className="text-gray-700 pt-4">
              The TruckingOffice ELD is great for owner operators and fleet builders that want an
              easy affordable way to stay compliant while also streamlining their business like the
              mega fleets do.
            </p>
            <p className="text-gray-700">
              It is also great for private fleets that want an easy to install and easy to manage
              ELD solution.
            </p>
            <p className="font-semibold text-gray-800">
              It is a great ELD solution, but it’s even better when paired with the TMS trucking software!
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="font-extrabold text-2xl lg:text-3xl mb-6" style={{ color: '#1f1f1f' }}>
            How To Order The ELD
          </h3>
          <p className="max-w-3xl mx-auto text-gray-700 mb-8">
            When you order your ELD, we’ll ship you the data reader that plugs into the ECM data
            port on your truck. It is used to read the required truck data from the ECM and sends
            it to your ELD mobile app on your phone or tablet. Don’t worry, it connects via
            bluetooth automatically plus we will send you our simple one page go-live guide.
          </p>
          <div className="flex justify-center">
            <HeroButton href="#order">Order Your ELD Now</HeroButton>
          </div>
          <a href="#eld-pricing" className="mt-4 inline-block text-sky-700 underline">
            Works on all makes and models, from light duty to heavy duty trucks.
          </a>
        </div>
      </div>
    </section>
  );
};

export default ELDSection;
