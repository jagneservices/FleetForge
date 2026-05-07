import React from 'react';
import Header from '../components/site/Header';
import Hero from '../components/site/Hero';
import OutcomesSection from '../components/site/OutcomesSection';
import SimplePath from '../components/site/SimplePath';
import ProductShowcase from '../components/site/ProductShowcase';
import FeaturedTestimonials from '../components/site/FeaturedTestimonials';
import CTASection from '../components/site/CTASection';
import Footer from '../components/site/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <Hero />
      <OutcomesSection />
      <SimplePath />
      <ProductShowcase />
      <FeaturedTestimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
