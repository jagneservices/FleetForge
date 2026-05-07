import React from 'react';
import { Star, Quote } from 'lucide-react';

const featured = [
  {
    quote: 'Reduced our office time by half. My husband has costs per truck and driver settlements at his fingertips.',
    name: 'Laura Cameron Hernandez',
    role: 'Trucking Company Owner',
  },
  {
    quote: 'Simplifies IFTA, IRP and makes tax preparation a breeze. Customer service is amazing. 10 stars.',
    name: 'Bill Barnes',
    role: 'Owner Operator',
  },
  {
    quote: 'I upload a fuel receipt from the ELD and it’s already on my TMS. Everything just syncs.',
    name: 'Susanelaine Coffer',
    role: 'Owner Operator',
  },
];

const FeaturedTestimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#d4a23a' }}>
            From the road
          </div>
          <h2 className="font-extrabold text-gray-900 leading-tight text-[34px] sm:text-[42px] lg:text-[50px]">
            Real truckers. <span style={{ color: '#d4a23a' }}>Real results.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((t, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <Quote className="h-8 w-8 mb-4" style={{ color: '#d4a23a' }} />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: '#d4a23a' }} />
                ))}
              </div>
              <p className="text-gray-800 leading-relaxed mb-6 text-[15px]">“{t.quote}”</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-bold" style={{ color: '#0a0a0a' }}>{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTestimonials;
