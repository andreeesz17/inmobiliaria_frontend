interface HamburgerMenuProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export default function HamburgerMenu({ onClick, isOpen }: HamburgerMenuProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-200 transition hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      aria-label="Abrir menú"
      aria-expanded={isOpen}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.8} 
        stroke="currentColor" 
        className="h-6 w-6 transition-transform duration-200"
        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} 
        />
      </svg>
    </button>
  );
}