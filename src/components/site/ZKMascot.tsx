export function ZKMascot() {
  return (
    <svg
      viewBox="0 0 210 220"
      role="img"
      aria-label="Mascote CORRES DO ZK correndo"
      className="h-full w-full"
    >
      <defs>
        <filter id="mascotShadow" x="-30%" y="-30%" width="170%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#000" floodOpacity=".7" />
        </filter>
      </defs>
      <g filter="url(#mascotShadow)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 178c29 9 53 13 82 12 34-2 57-9 76-23" fill="none" stroke="#f2f2f2" strokeWidth="12" opacity=".9" />
        <path d="M65 71c-18 10-29 32-26 55 2 18 10 32 25 43" fill="#101010" stroke="#f2f2f2" strokeWidth="6" />
        <path d="M67 74c8-11 20-18 35-18 17 0 31 8 40 22l-9 46-59 3z" fill="#181818" stroke="#f2f2f2" strokeWidth="6" />
        <path d="M86 39c0-16 13-28 29-28 12 0 23 7 27 18l-8 27-38 2z" fill="#d8d8d8" stroke="#f2f2f2" strokeWidth="6" />
        <path d="M82 35c16-17 38-20 62-6l7 9c-21-3-38 0-56 12z" fill="#0a0a0a" stroke="#f2f2f2" strokeWidth="5" />
        <path d="M133 48c4 7 4 13 0 19" fill="none" stroke="#e01b24" strokeWidth="5" />
        <path d="M99 73l9 13 13-12" fill="none" stroke="#e01b24" strokeWidth="5" />
        <path d="M85 94h43" fill="none" stroke="#e01b24" strokeWidth="6" />
        <path d="M79 119c16 5 34 6 51 2l15 32-30 18-25-19z" fill="#272727" stroke="#f2f2f2" strokeWidth="6" />
        <path d="M97 166l-24 30" fill="none" stroke="#f2f2f2" strokeWidth="16" />
        <path d="M125 164l32 23" fill="none" stroke="#f2f2f2" strokeWidth="16" />
        <path d="M56 198c8-7 18-8 28-3l8 8-43 5z" fill="#0a0a0a" stroke="#f2f2f2" strokeWidth="5" />
        <path d="M150 188c10-4 20 0 28 8l-2 10-42-8z" fill="#0a0a0a" stroke="#f2f2f2" strokeWidth="5" />
        <path d="M57 100l-26 35 28 12" fill="none" stroke="#f2f2f2" strokeWidth="14" />
        <path d="M139 91l32 24-12 28" fill="none" stroke="#f2f2f2" strokeWidth="14" />
        <path d="M126 103l31 6-8 39-31-7z" fill="#e01b24" stroke="#f2f2f2" strokeWidth="5" />
        <path d="M132 114h18M132 124h13" stroke="#f2f2f2" strokeWidth="4" />
        <path d="M94 101l8-14 8 14 10-10" fill="none" stroke="#e01b24" strokeWidth="5" />
        <circle cx="118" cy="42" r="3" fill="#111" />
        <path d="M122 51c5 2 9 1 12-1" fill="none" stroke="#111" strokeWidth="3" />
      </g>
    </svg>
  );
}
