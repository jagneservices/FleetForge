import React from 'react';
import { HeroButton } from './Hero';

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#cdd5dc' }}>
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-extrabold text-gray-900 text-[32px] sm:text-[40px] lg:text-[52px]">
          How To Get started
        </h2>
        <p className="mt-8 text-gray-800 text-lg lg:text-xl leading-relaxed text-left max-w-3xl mx-auto">
          Getting started with TruckingOffice is easy. We offer a no obligation free trial of our
          trucking software so that you can try it before you buy it.
        </p>
        <p className="mt-6 text-gray-800 text-lg lg:text-xl leading-relaxed text-left max-w-3xl mx-auto">
          It only takes a minute to fill out the short form to get started then you will have access
          to the full version of the trucking software. After you enter a few loads into the system,
          you will see results immediately.
        </p>
        <div className="mt-10 flex justify-center">
          <HeroButton href="#trial">Start Free Trial Today</HeroButton>
        </div>
        <a
          href="#trial"
          className="mt-6 inline-block text-sky-700 hover:text-sky-900 underline text-base"
        >
          No obligation free trial. Start now with no credit card required!
        </a>
      </div>
    </section>
  );
};

export default CTASection;
