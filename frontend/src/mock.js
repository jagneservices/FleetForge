// Mock data for FleetForge clone

export const navItems = [
  { label: 'Home', href: '#home', hasDropdown: false, isHome: true },
  { label: 'TMS', href: '#tms', hasDropdown: true, items: ['Overview', 'Dispatch', 'Invoicing', 'Reports', 'Pricing'] },
  { label: 'ELD', href: '#eld', hasDropdown: true, items: ['Overview', 'Compliance', 'ELD Pricing', 'How It Works'] },
  { label: 'Our Story', href: '#story', hasDropdown: false },
  { label: 'Blog', href: '#blog', hasDropdown: false },
  { label: 'Support', href: '#support', hasDropdown: false },
];

export const testimonials = [
  {
    id: 1,
    quote: "I like this program because it syncs with each other so if I upload fuel receipt from the ELD it's already on my TMS.",
    name: 'Susanelaine Coffer',
    role: 'Owner Operator',
  },
  {
    id: 2,
    quote: 'Great app. Keeps track of everything and sends it to TMS. FleetForge is the way to go. Customer service is amazing. Simplifies IFTA, IRP and makes tax preparation a breeze. 10 Stars',
    name: 'Bill Barnes',
    role: 'Owner Operator',
  },
  {
    id: 3,
    quote: 'great software. easy to navigate. helps me to keep track of my numbers',
    name: 'Marcus Keith',
    role: 'Owner Operator, Trucking Company Owner',
  },
  {
    id: 4,
    quote: 'I reviewed several dispatch software programs for our small trucking company. All of the costs were exorbitant in relation to our smaller than normal profit margins. I found FleetForge.com on a Google search, signed up for the free trial, within 2 weeks, I signed up for the paid subscription. This app has reduced our office time by half, as we were using excel, quick books, etc for each different function. My husband has all of his costs per truck and driver settlements right at his fingertips. In addition to making my accounting life easier, I have daily reminders of driver license and medical card expiration, truck maintenance notifications, etc. Love this program! Perfect for our small business!',
    name: 'Laura Cameron Hernandez',
    role: 'Trucking Company Owner, Trucking Business',
  },
  {
    id: 5,
    quote: 'Trucking Office has been amazing! It’s so simple to use. Thanks for sharing your creation.',
    name: 'Shipwise Transport',
    role: 'Fleet Owner',
  },
];

export const processSteps = [
  {
    number: 1,
    title: 'Haul',
    subtitle: 'the Load',
    items: [
      { tag: 'TMS', title: 'Create a planned load (enter load details)', desc: 'Address book updated with all customer, shipper, and consignee info' },
      { tag: 'TMS', title: 'Dispatch the load by creating a trip', desc: 'All rates calculated, trip info automatically sent to driver’s ELD, all reports updated, per mile truck stats created' },
      { tag: 'ELD', title: 'The driver receives load info in his ELD app', desc: 'Driver sees the trip info in the upcoming trips section of his ELD mobile app' },
      { tag: 'ELD', title: 'The driver indicates that he is loaded', desc: 'Update status from the ELD mobile app, load status in TMS updated to in transit' },
    ],
  },
  {
    number: 2,
    title: 'Track',
    subtitle: 'the Details',
    items: [
      { tag: 'ELD', title: 'Driver uploads trip-related receipts using his ELD app', desc: 'Trip receipts show up in the TMS as expenses assigned to the current trip, per mile trucker stats updated' },
      { tag: 'ELD', title: 'The driver indicates that he has delivered', desc: 'Update status from the ELD mobile app, load status in TMS updated to delivered' },
      { tag: 'ELD', title: 'Driver uploads signed BOL for POD', desc: 'Update status from the ELD mobile app, load status in TMS updated to delivered with BOL (ready to invoice)' },
      { tag: 'ELD', title: 'Driver clears current trip and waits for next dispatch', desc: 'If another trip is already assigned to the driver then he will automatically see it in his ELD mobile app' },
    ],
  },
  {
    number: 3,
    title: 'Get',
    subtitle: 'Paid',
    items: [
      { tag: 'TMS', title: 'Create an invoice using the 2-click invoice process', desc: 'Invoice created, reports updated' },
      { tag: 'TMS', title: 'Send an invoice and all related documents via email', desc: 'Track email status (sent, delivered, opened)' },
      { tag: 'TMS', title: 'Enter payment when it is received', desc: 'All reports updated, per mile trucker stats updated' },
    ],
  },
];

export const tmsFeatures = [
  { title: 'Dispatch', desc: 'enter load details when you book the load. Send the loading instructions to driver, create driver settlements, reports and address book updated automatically' },
  { title: 'Invoice', desc: 'Create – Send – Track Payments' },
  { title: 'Expenses', desc: 'custom categoried – assign to truck, driver, and trip' },
  { title: 'Trucker Stats', desc: 'Per mile stats to stay ahead of the game.' },
];

export const eldFeatures = [
  { title: 'Plug and Play', desc: 'plug the data reader into your truck and it syncs to your mobile app automatically' },
  { title: 'Easy to use', desc: 'record, update, and edit your logs with ease' },
  { title: 'Compliance', desc: 'Fully compliant with all regulations of the ELD mandate.' },
  { title: 'Dispatcher Dashboard', desc: 'driver locations, available time on the hours of service timers' },
];

export const guarantees = [
  { title: 'Online Software', desc: 'access from any device at any time' },
  { title: 'Security Guaranteed', desc: 'system is backed up and monitored constantly' },
  { title: 'Privacy Guaranteed', desc: 'personal private account – your data is never shared with anyone' },
  { title: 'Satisfaction Guaranteed', desc: 'no contracts – cancel any time' },
  { title: 'No Set Up Fees', desc: 'users always tell us how easy it is to learn and to use' },
  { title: 'Free Support', desc: 'we are here for you when you need an extra hand' },
];

export const footerLinks = {
  product: [
    { label: 'Trucking Software (TMS)', href: '#tms' },
    { label: 'Electronic Logbook (ELD)', href: '#eld' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Free Trial', href: '#trial' },
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
