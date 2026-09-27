"use client";

export function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border border-amber-500/40">
          <svg viewBox="0 0 24 24" fill="none" className="w-3/5 h-3/5">
            <path
              d="M7 14 Q4 14 4 11 Q4 8 7 8 Q7.5 5 10.5 5 Q13 5 13.5 7 Q14 6.5 15.5 6.5 Q18 6.5 18 9 Q20 9 20 11 Q20 14 18 14 Z"
              fill="white"
              fillOpacity="0.95"
            />
            <path d="M12 15 L9 20 L11.5 20 L10 24 L15 18 L12.5 18 L14 15 Z" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      {showText && (
        <div>
          <h2 className="font-serif text-lg font-bold leading-tight tracking-tight">
            AtmosAI
          </h2>
          <p className="micro-label">AWS Command</p>
        </div>
      )}
    </div>
  );
}