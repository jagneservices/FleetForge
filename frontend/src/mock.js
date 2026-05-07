// Static content for the marketing landing page
// (App data lives in MongoDB and is fetched via /api)

export const navItems = [
  { label: 'Home', href: '#home', hasDropdown: false, isHome: true },
  { label: 'Product', href: '#product', hasDropdown: true, items: ['TMS', 'ELD', 'Documents', 'Compliance'] },
  { label: 'How it works', href: '#how', hasDropdown: false },
  { label: 'Outcomes', href: '#outcomes', hasDropdown: false },
];

export const footerLinks = {
  product: [
    { label: 'Trucking Software (TMS)', href: '#tms' },
    { label: 'Electronic Logbook (ELD)', href: '#eld' },
    { label: 'Documents', href: '#documents' },
    { label: 'Free Trial', href: '/register' },
  ],
  company: [
    { label: 'Our Story', href: '#story' },
    { label: 'Blog', href: '#blog' },
    { label: 'Support', href: '#support' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
};
