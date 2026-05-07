import React from 'react';
import { Truck, MapPin, DollarSign, ArrowRight } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Truck,
    title: 'Dispatch',
    desc: 'Book a load and assign it to a driver. Trip details, addresses, and rates flow into the driver’s ELD app instantly.',
  },
  {
    n: '02',
    icon: MapPin,
    title: 'Track',
    desc: 'Watch progress in real time, capture receipts and BOLs from the road, and update status with one tap.',
  },
  {
    n: '03',
    icon: DollarSign,
    title: 'Get Paid',
    desc: 'Generate an invoice in two clicks, email it with the POD attached, and track when it’s opened and paid.',
  },
];

const SimplePath = () => {
  return (
    <section
      id="how"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(212,162,58,0.4), transparent 50%)',
        }}
      />
      <div className="relative max-w-[1180px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#d4a23a' }}>
            How it works
          </div>
          <h2 className="font-extrabold text-white leading-tight text-[34px] sm:text-[42px] lg:text-[50px]">
            Three steps. <span style={{ color: '#d4a23a' }}>That’s it.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-4 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="relative">
                <div className="bg-[#111] border border-white/10 rounded-2xl p-8 h-full hover:border-[#d4a23a]/60 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="text-5xl font-extrabold"
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '1.5px #d4a23a',
                      }}
                    >
                      {s.n}
                    </div>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(212,162,58,0.15)' }}
                    >
                      <Icon className="h-6 w-6" style={{ color: '#d4a23a' }} />
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl text-white mb-3">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#d4a23a' }}
                    >
                      <ArrowRight className="h-4 w-4" style={{ color: '#0a0a0a' }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimplePath;
