import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialQuote = ({ quote, name, role, bg = 'bg-gray-100' }) => {
  return (
    <div className={`${bg} py-12 lg:py-16`}>
      <div className="max-w-[900px] mx-auto px-4 lg:px-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <Quote className="h-5 w-5 text-gray-600" />
          </div>
        </div>
        <p className="text-gray-800 text-lg lg:text-xl leading-relaxed italic">{quote}</p>
        <div className="mt-6">
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialQuote;
