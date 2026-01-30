export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <h1 className="text-slate-800 tracking-wide" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.1 }}>
            DECRETUM
          </h1>
          <p className="text-slate-600 tracking-wide" style={{ fontSize: '0.65rem', lineHeight: 1.3 }}>
            Search decisions, draft smarter.
          </p>
        </div>
      )}
    </div>
  );
}

export function LogoCompact() {
  return (
    <div className="relative group">
      <h1 className="text-slate-800 tracking-wide" style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.1 }}>
        DECRETUM
      </h1>
    </div>
  );
}
