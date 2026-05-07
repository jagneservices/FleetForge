// Tiny formatting helpers
export const money = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n));
};

export const moneyExact = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));
};

export const initials = (name) => {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
};

export const STATUSES = ['Pending', 'Dispatched', 'In Transit', 'Delivered', 'Completed'];

export const statusStyle = (s) => {
  switch (s) {
    case 'Pending':
      return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
    case 'Dispatched':
      return { bg: 'bg-amber-100', text: 'text-amber-900', dot: 'bg-amber-500' };
    case 'In Transit':
      return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
    case 'Delivered':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' };
    case 'Completed':
      return { bg: 'bg-[#fdf2d6]', text: 'text-[#8a6a14]', dot: 'bg-[#d4a23a]' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
  }
};

export const complianceStyle = (s) => {
  switch (s) {
    case 'Complete':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' };
    case 'Expiring':
      return { bg: 'bg-amber-100', text: 'text-amber-900', dot: 'bg-amber-500' };
    case 'Missing':
      return { bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
  }
};
