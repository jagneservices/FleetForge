import React from 'react';
import { DollarSign, ShieldCheck, Trophy, Clock } from 'lucide-react';

const outcomes = [
  {
    icon: DollarSign,
    title: 'Get paid faster',
    desc: 'Two-click invoices, automated email delivery, and real-time payment tracking shrink your days-to-pay.',
    stat: '38% faster',
    statLabel: 'avg. invoice payment',
  },
  {
    icon: ShieldCheck,
    title: 'Stay compliant',
    desc: 'FMCSA-compliant ELD, IFTA reports, and driver license &amp; medical card reminders — done.',
    stat: '100%',
    statLabel: 'ELD mandate compliant',
  },
  {
    icon: Trophy,
    title: 'Win more loads',
    desc: 'Per-mile stats and instant rate analysis tell you which loads are profitable before you book.',
    stat: '+22%',
    statLabel: 'avg. revenue per mile',
  },
  {
    icon: Clock,
    title: 'Save hours every week',
    desc: 'Replace spreadsheets and three apps with one. Customers cut back-office time in half.',
    stat: '10+ hrs',
    statLabel: 'saved per week',
  },
];

const OutcomesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#d4a23a' }}>
            Outcomes, not features
          </div>
          <h2 className="font-extrabold text-gray-900 leading-tight text-[34px] sm:text-[42px] lg:text-[50px]">
            What FleetForge actually delivers.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We don’t sell software. We sell results that show up in your bank account.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((o) => {
            const Icon = o.icon;
            return (
              <div
                key={o.title}
                className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-[#d4a23a] hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-opacity opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: '#d4a23a' }}
                />
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(212,162,58,0.12)' }}
                >
                  <Icon className="h-6 w-6" style={{ color: '#d4a23a' }} />
                </div>
                <div className="font-extrabold text-2xl mb-1" style={{ color: '#0a0a0a' }}>
                  {o.stat}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  {o.statLabel}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{o.title}</h3>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: o.desc }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OutcomesSection;
