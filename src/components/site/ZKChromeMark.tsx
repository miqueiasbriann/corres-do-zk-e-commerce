export function ZKChromeMark() {
  return (
    <div className="zk-chrome-crown-shell" aria-hidden="true">
      <svg viewBox="0 0 260 190" className="zk-chrome-crown" role="presentation">
        <defs>
          <linearGradient id="zkChrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4b4b4b" />
            <stop offset=".15" stopColor="#f7f7f7" />
            <stop offset=".3" stopColor="#7a7a7a" />
            <stop offset=".48" stopColor="#ffffff" />
            <stop offset=".64" stopColor="#5f5f5f" />
            <stop offset=".82" stopColor="#d7d7d7" />
            <stop offset="1" stopColor="#737373" />
          </linearGradient>
          <linearGradient id="zkRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff3434" />
            <stop offset="1" stopColor="#8f0007" />
          </linearGradient>
          <filter id="zkCrownShadow" x="-40%" y="-40%" width="190%" height="200%">
            <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#000" floodOpacity=".72" />
          </filter>
        </defs>
        <g filter="url(#zkCrownShadow)" className="zk-chrome-crown-tilt">
          <path d="M37 141L52 58l48 40 31-69 35 69 45-42 13 85z" fill="#151515" stroke="#181818" strokeWidth="24" opacity=".7" transform="translate(7 11)" />
          <path d="M37 141L52 58l48 40 31-69 35 69 45-42 13 85z" fill="none" stroke="url(#zkRed)" strokeWidth="19" />
          <path d="M37 141L52 58l48 40 31-69 35 69 45-42 13 85z" fill="none" stroke="url(#zkChrome)" strokeWidth="10" />
          <path d="M46 151h171" stroke="url(#zkChrome)" strokeWidth="12" />
          <circle cx="52" cy="57" r="8" fill="url(#zkChrome)" />
          <circle cx="131" cy="28" r="8" fill="url(#zkChrome)" />
          <circle cx="211" cy="55" r="8" fill="url(#zkChrome)" />
        </g>
      </svg>
    </div>
  );
}
