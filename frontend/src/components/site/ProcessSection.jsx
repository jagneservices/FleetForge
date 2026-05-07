import React from 'react';
import { Truck, ClipboardCheck, FileCheck, Send, Mail, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import { processSteps } from '../../mock';

const stepColors = {
  1: { bg: '#c81f1f', light: '#fde7e7' },
  2: { bg: '#c81f1f', light: '#fde7e7' },
  3: { bg: '#c81f1f', light: '#fde7e7' },
};

const tagColor = (tag) => (tag === 'TMS' ? '#1f3a8a' : '#c81f1f');

const stepIcons = [Truck, MapPin, FileCheck, Send, Mail, DollarSign, ClipboardCheck];

const ProcessSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-4">
          <p className="font-semibold text-gray-700 text-lg">How does it work?</p>
          <h2 className="mt-2 font-extrabold text-[28px] sm:text-[36px] lg:text-[44px]" style={{ color: '#1f1f1f' }}>
            The power is in the process!
          </h2>
        </div>

        {/* Top banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 mt-10">
          <div className="flex items-end gap-3">
            <div className="font-extrabold text-[80px] leading-none" style={{ color: '#c81f1f' }}>3</div>
            <div className="flex flex-col leading-tight">
              <div className="italic font-bold text-2xl" style={{ color: '#c81f1f' }}>Easy</div>
              <div className="font-extrabold text-3xl" style={{ color: '#1f3a8a' }}>Steps</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Truck className="h-16 w-16" style={{ color: '#c81f1f' }} strokeWidth={1.5} />
            <div>
              <div className="font-extrabold text-2xl" style={{ color: '#1f3a8a' }}>
                <span style={{ color: '#c81f1f' }}>#</span>AfterFreight
              </div>
              <p className="text-gray-700 max-w-md text-sm">
                Trucking software system designed to manage everything that happens after you book the freight.
              </p>
            </div>
          </div>
        </div>

        {/* 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {processSteps.map((step) => (
            <div key={step.number} className="flex flex-col">
              {/* Header */}
              <div
                className="text-white p-5 rounded-md flex items-center gap-4 shadow-md"
                style={{ backgroundColor: stepColors[step.number].bg }}
              >
                <div className="text-5xl font-extrabold leading-none">{step.number}</div>
                <div className="leading-tight">
                  <div className="text-2xl font-bold">{step.title}</div>
                  <div className="text-xl">{step.subtitle}</div>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 space-y-5">
                {step.items.map((it, idx) => {
                  const Icon = stepIcons[(step.number * 7 + idx) % stepIcons.length];
                  return (
                    <div key={idx} className="flex gap-3 group">
                      <div
                        className="shrink-0 w-14 h-14 rounded-md flex items-center justify-center text-white font-bold text-xs shadow transition-transform group-hover:scale-105"
                        style={{ backgroundColor: tagColor(it.tag), transform: 'rotate(45deg)' }}
                      >
                        <span style={{ transform: 'rotate(-45deg)' }}>{it.tag}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[15px]" style={{ color: tagColor(it.tag) }}>
                          {it.title}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{it.desc}</p>
                      </div>
                      <Icon className="h-8 w-8 text-gray-400 shrink-0 mt-1" strokeWidth={1.5} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
