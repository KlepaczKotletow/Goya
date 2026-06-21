type P = { className?: string };
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const SearchIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
);
export const BagIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
);
export const HeartIcon = ({ className, filled }: P & { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s} fill={filled ? "currentColor" : "none"}>
    <path d="M12 21s-7.4-4.55-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.05 3.9 2.05.6 1 .9 1 .9 1s.3 0 .9-1C11.5 6.05 12.8 5 14.8 5 18 5 19.6 8.4 18 11.7 15.4 16.45 12 21 12 21z" />
  </svg>
);
export const BurgerIcon = ({ className }: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...s}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...s}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ArrowIcon = ({ className }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...s}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ChevronIcon = ({ className }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...s}><path d="m6 9 6 6 6-6" /></svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...s}><path d="M20 6 9 17l-5-5" /></svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const TruckIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
);
export const ReturnIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M3 8a9 9 0 1 1-1.5 5" /><path d="M3 4v4h4" /></svg>
);
export const SunIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
);
export const StarIcon = ({ className, filled = true }: P & { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </svg>
);
export const AppleIcon = ({ className }: P) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.2-.9-2.2-3.6ZM14.3 6.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
  </svg>
);
export const GPayIcon = ({ className }: P) => (
  <svg width="34" height="16" viewBox="0 0 50 20" className={className} aria-hidden>
    <text x="0" y="15" fontSize="15" fontWeight="700" fontFamily="Arial, sans-serif">
      <tspan fill="#4285F4">G</tspan><tspan fill="#34A853">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan><tspan fill="#5f6368"> Pay</tspan>
    </text>
  </svg>
);
