import React from 'react';
import { ShieldCheck, Lock, Eye, Smile, BadgeCheck, Headphones } from 'lucide-react';
import { guarantees } from '../../mock';

const icons = [Eye, ShieldCheck, Lock, Smile, BadgeCheck, Headphones];

const GuaranteeSection = () => {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-10 items-center">
        {/* Quality guarantee badge */}
        <div className="flex justify-center">
          <div className="relative w-[260px] h-[260px] rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-8" style={{ borderColor: '#d4a23a' }}>
            <div className="absolute inset-3 rounded-full border-2" style={{ borderColor: '#1a1a1a' }} />
            <ShieldCheck className="h-16 w-16" style={{ color: '#1a1a1a' }} strokeWidth={1.5} />
            <div className="mt-2 text-center font-extrabold uppercase" style={{ color: '#1a1a1a' }}>
              <div className="text-2xl">Quality</div>
              <div className="text-xl" style={{ color: '#d4a23a' }}>Guaranteed</div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          {guarantees.map((g, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={g.title}
                className="bg-white rounded-md p-5 shadow-md border-l-4 hover:shadow-lg transition-shadow"
                style={{ borderColor: '#d4a23a' }}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-6 w-6 shrink-0 mt-0.5" style={{ color: '#1a1a1a' }} />
                  <div>
                    <div className="font-bold text-gray-900">{g.title}</div>
                    <div className="text-sm text-gray-700">– {g.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tagline strip */}
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[
          "Don't worry about your computer crashing or losing all of your business records!",
          'You will love our software, but if not 100% satisfied, you can cancel anytime.',
          'No surprise set up fees!',
          'We are here to help! Free support!',
        ].map((t, i) => (
          <div key={i} className="font-semibold text-gray-800">
            {t}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuaranteeSection;
