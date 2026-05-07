import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../mock';

const TestimonialsList = () => {
  const list = testimonials.slice(2);
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <h2 className="text-center font-extrabold text-[28px] sm:text-[36px] lg:text-[44px] text-gray-900">
          What do our customers say?
        </h2>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <Quote className="h-6 w-6" style={{ color: '#d4a23a' }} />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{t.quote}</p>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="font-bold" style={{ color: '#d4a23a' }}>{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsList;
