import React from 'react';
import { Laptop, Smartphone } from 'lucide-react';

const IntegrationSection = () => {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#cdd5dc' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-extrabold text-gray-900 leading-tight text-[34px] sm:text-[42px] lg:text-[52px]">
            Get the <br />
            trucking software <br />
            and ELD <br />
            that work together!
          </h2>
        </div>

        {/* Visual integration card */}
        <div className="relative bg-white rounded-lg shadow-xl p-8 lg:p-10">
          {/* TMS panel */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-3xl font-extrabold" style={{ color: '#c81f1f' }}>TMS</div>
              <div className="text-sm font-semibold leading-tight" style={{ color: '#1f3a8a' }}>
                Trucking <br /> Software
              </div>
            </div>
            <Laptop className="h-20 w-20" style={{ color: '#1f3a8a' }} strokeWidth={1.5} />
          </div>

          {/* Seamless Integration banner */}
          <div
            className="relative -mx-8 lg:-mx-10 py-5 text-center text-white font-bold tracking-wide"
            style={{ backgroundColor: '#c81f1f' }}
          >
            <div className="text-xl">Seamless</div>
            <div className="text-xl">Integration</div>
          </div>

          {/* ELD panel */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <Smartphone className="h-20 w-20" style={{ color: '#1f3a8a' }} strokeWidth={1.5} />
            <div className="text-right">
              <div className="text-3xl font-extrabold" style={{ color: '#c81f1f' }}>ELD</div>
              <div className="text-sm font-semibold leading-tight" style={{ color: '#1f3a8a' }}>
                Electronic <br /> Logbook
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
