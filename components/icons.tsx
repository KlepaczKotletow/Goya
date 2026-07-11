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
export const InstagramIcon = ({ className }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...s}><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>
);
export const TikTokIcon = ({ className }: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" className={className} {...s}><path d="M14 4c.3 2.3 1.8 4 4 4.2" /><path d="M14 4v10.2a3.4 3.4 0 1 1-3-3.38" /></svg>
);
export const GlassesIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><circle cx="6" cy="13" r="3.2" /><circle cx="18" cy="13" r="3.2" /><path d="M9.2 12.4c.9-1 4.7-1 5.6 0M3 11.5 4.4 9H6M21 11.5 19.6 9H18" /></svg>
);
export const StarIcon = ({ className, filled = true }: P & { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </svg>
);
export const AppleIcon = ({ className }: P) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.2-.9-2.2-3.6ZM14.3 6.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" />
  </svg>
);
export const GPayIcon = ({ className }: P) => (
  <svg viewBox="0 0 36 14" width="40" height="16" className={className} fill="currentColor" aria-hidden>
    <path d="M17.04 6.84v3.99h-1.27v-9.86h3.36c.84 0 1.56.28 2.15.85.6.56.9 1.25.9 2.06 0 .83-.3 1.52-.9 2.07-.58.56-1.3.84-2.15.84h-2.09v.05zm0-4.66v3.45h2.12c.49 0 .91-.17 1.24-.5.34-.33.51-.74.51-1.21 0-.46-.17-.86-.51-1.19-.33-.34-.74-.51-1.24-.51h-2.12v-.04zM26.93 4.85c.94 0 1.68.25 2.22.75.54.51.81 1.2.81 2.07v4.16h-1.21v-.94h-.06c-.52.77-1.22 1.16-2.09 1.16-.75 0-1.37-.22-1.87-.66-.5-.45-.74-1-.74-1.66 0-.7.27-1.26.8-1.67.53-.42 1.24-.62 2.13-.62.76 0 1.39.14 1.88.42v-.29c0-.44-.17-.81-.52-1.12-.34-.31-.74-.46-1.21-.46-.7 0-1.25.3-1.66.89l-1.12-.7c.6-.88 1.49-1.33 2.64-1.33zm-1.63 4.88c0 .33.14.6.42.82.28.22.6.33.97.33.53 0 1-.2 1.42-.59.41-.39.62-.85.62-1.39-.4-.32-.95-.48-1.66-.48-.52 0-.95.13-1.3.38-.32.26-.47.57-.47.93zM36 5.07l-4.24 9.7H30.45l1.57-3.4-2.78-6.3h1.39l2.01 4.84h.03l1.96-4.84z" />
    <path d="M11.36 7.18c0-.41-.04-.81-.11-1.18H5.83v2.24h3.1c-.13.73-.55 1.35-1.18 1.77v1.46h1.88c1.1-1.01 1.73-2.51 1.73-4.29z" fill="#4285F4" />
    <path d="M5.83 12.96c1.6 0 2.94-.53 3.92-1.43L7.87 10.07c-.52.35-1.19.56-2.04.56-1.56 0-2.89-1.05-3.36-2.47H.53v1.5c.97 1.95 2.98 3.3 5.3 3.3z" fill="#34A853" />
    <path d="M2.47 8.16c-.12-.36-.19-.74-.19-1.14s.07-.78.19-1.14V4.38H.53C.13 5.16-.09 6.05-.09 7.02s.22 1.86.62 2.64l1.94-1.5z" fill="#FBBC05" />
    <path d="M5.83 3.41c.88 0 1.66.3 2.28.89l1.7-1.7C8.76 1.65 7.42 1.08 5.83 1.08 3.51 1.08 1.5 2.43.53 4.38l1.94 1.5c.47-1.42 1.8-2.47 3.36-2.47z" fill="#EA4335" />
  </svg>
);
export const EyeIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.8" /></svg>
);
export const PackageIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="M3.3 7 12 12l8.7-5M12 22V12" /></svg>
);
export const ClothIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className} {...s}><path d="M3 7l9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>
);
