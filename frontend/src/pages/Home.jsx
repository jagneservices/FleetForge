import React from 'react';
import Header from '../components/site/Header';
import Hero from '../components/site/Hero';
import IntegrationSection from '../components/site/IntegrationSection';
import ProcessSection from '../components/site/ProcessSection';
import TestimonialQuote from '../components/site/TestimonialQuote';
import CTASection from '../components/site/CTASection';
import TMSSection from '../components/site/TMSSection';
import PopularSection from '../components/site/PopularSection';
import ELDSection from '../components/site/ELDSection';
import GuaranteeSection from '../components/site/GuaranteeSection';
import TestimonialsList from '../components/site/TestimonialsList';
import Footer from '../components/site/Footer';
import { testimonials } from '../mock';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <Hero />
      <IntegrationSection />
      <ProcessSection />
      <TestimonialQuote {...testimonials[0]} bg="bg-gray-100" />
      <CTASection />
      <TestimonialQuote {...testimonials[1]} bg="bg-gray-50" />
      <TMSSection />
      <PopularSection />
      <CTASection />
      <ELDSection />
      <GuaranteeSection />
      <TestimonialsList />
      <Footer />
    </div>
  );
};

export default Home;
