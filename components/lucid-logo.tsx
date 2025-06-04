export function LucidLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Main circle background */}
      <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />

      {/* Inner design - representing cash/payment */}
      <rect x="10" y="12" width="20" height="12" rx="2" fill="url(#innerGradient)" />
      <rect x="12" y="14" width="16" height="8" rx="1" fill="none" stroke="#10b981" strokeWidth="1" />

      {/* Cash register display */}
      <rect x="14" y="16" width="12" height="2" rx="1" fill="#10b981" />
      <rect x="14" y="19" width="8" height="1" rx="0.5" fill="#10b981" opacity="0.7" />

      {/* Dollar sign */}
      <text x="20" y="32" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold">
        $
      </text>

      {/* Lucid shine effect */}
      <path d="M12 8 L28 8 Q30 10 28 12 L12 12 Q10 10 12 8" fill="white" opacity="0.3" />
    </svg>
  )
}
