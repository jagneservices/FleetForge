import React from 'react';
import { Award } from 'lucide-react';

const PopularSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2
            className="font-extrabold italic leading-tight text-[26px] sm:text-[32px] lg:text-[38px]"
            style={{ color: '#1f6dc9', textShadow: '2px 2px 0 #d6e6f7' }}
          >
            TruckingOffice is the most popular software for owner operators and fleet builders everywhere because it is so easy, effective, and affordable!
          </h2>
        </div>

        {/* Choice badge */}
        <div className="flex justify-center">
          <div
            className="relative w-[230px] h-[300px] rounded-md flex flex-col items-center justify-center shadow-2xl"
            style={{
              background:
                'repeating-radial-gradient(circle at 50% 30%, #2563eb 0 2px, #1e40af 2px 4px)',
            }}
          >
            <div className="absolute inset-2 border-4 border-white/40 rounded-md" />
            <Award className="h-10 w-10 text-white mb-2" />
            <div
              className="font-extrabold text-[110px] leading-none"
              style={{
                color: '#e5e7eb',
                textShadow: '3px 3px 0 #1f3a8a, -1px -1px 0 #fff',
              }}
            >
              #1
            </div>
            <div
              className="mt-2 px-3 py-2 text-center text-white font-extrabold text-[18px] leading-tight"
              style={{ backgroundColor: '#c81f1f', transform: 'skewY(-3deg)' }}
            >
              CHOICE FOR <br /> OWNER <br /> OPERATORS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSection;
