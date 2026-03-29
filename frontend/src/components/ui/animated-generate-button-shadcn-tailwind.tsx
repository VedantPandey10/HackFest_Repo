import * as React from "react";
import clsx from "clsx";

export type AnimatedGenerateButtonProps = {
  className?: string;
  labelIdle?: React.ReactNode;
  labelActive?: React.ReactNode;
  generating?: boolean;
  highlightHueDeg?: number; // Kept for types but defaulted to brand indigo
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
};

export default function AnimatedGenerateButton({
  className,
  labelIdle = "Continue",
  labelActive = "Processing",
  generating = false,
  highlightHueDeg = 245, // Brand Indigo
  onClick,
  type = "button",
  disabled = false,
  id,
  ariaLabel,
}: AnimatedGenerateButtonProps) {
  const isStringIdle = typeof labelIdle === "string";
  const isStringActive = typeof labelActive === "string";

  return (
    <div className={clsx("relative inline-block", className)} id={id}>
      <button
        type={type}
        aria-label={ariaLabel || (generating ? String(labelActive) : String(labelIdle))}
        aria-pressed={generating}
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          "ui-glass-btn",
          "relative flex items-center justify-center cursor-pointer select-none",
          "rounded-[20px] px-8 py-3 min-w-[160px]",
          "text-white font-bold",
          "transition-[box-shadow,border,background-color,transform] duration-500 active:scale-95"
        )}
      >
        <div className="ui-glass-btn-bg" />
        <div className="ui-glass-btn-glow" />
        
        <div className="ui-anim-txt-wrapper relative flex items-center overflow-hidden pointer-events-none z-10">
          <div
            className={clsx(
              "ui-anim-txt-1 whitespace-nowrap flex transition-all duration-500",
              generating ? "-translate-y-full opacity-0 blur-sm" : "translate-y-0 opacity-100"
            )}
          >
            {isStringIdle ? Array.from(String(labelIdle)).map((ch, i) => (
              <span 
                key={i} 
                className="ui-anim-letter inline-block min-w-[0.3em] font-black uppercase tracking-[0.15em] text-xs" 
                style={{ '--i': i } as React.CSSProperties}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            )) : labelIdle}
          </div>
          <div
            className={clsx(
              "ui-anim-txt-2 absolute whitespace-nowrap flex transition-all duration-500",
              generating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 blur-sm"
            )}
          >
            {isStringActive ? Array.from(String(labelActive)).map((ch, i) => (
              <span 
                key={i} 
                className="ui-anim-letter inline-block min-w-[0.3em] font-black uppercase tracking-[0.15em] text-xs" 
                style={{ '--i': i } as React.CSSProperties}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            )) : labelActive}
          </div>
        </div>
      </button>

      <style>{`
        .ui-glass-btn {
          --brand-color: hsl(${highlightHueDeg}, 100%, 70%);
          --brand-glow: hsla(${highlightHueDeg}, 100%, 60%, 0.5);
          --glass-bg: hsla(${highlightHueDeg}, 100%, 40%, 0.05);
          --glass-border: hsla(${highlightHueDeg}, 100%, 50%, 0.1);
          z-index: 1;
        }

        .ui-glass-btn-bg {
          position: absolute;
          inset: 0;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: inherit;
          z-index: -1;
          transition: all 0.4s ease;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .ui-glass-btn:hover .ui-glass-btn-bg {
          background: hsla(${highlightHueDeg}, 100%, 50%, 0.12);
          border-color: hsla(${highlightHueDeg}, 100%, 60%, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px hsla(${highlightHueDeg}, 100%, 50%, 0.2),
                      inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .dark .ui-glass-btn-bg {
          background: rgba(15, 23, 42, 0.6);
        }

        .ui-glass-btn-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                      var(--brand-glow) 0%, 
                      transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          border-radius: inherit;
          pointer-events: none;
          z-index: -1;
        }

        .ui-glass-btn:hover .ui-glass-btn-glow {
          opacity: 0.2;
        }

        /* Border Light Trail (Simplified) */
        .ui-glass-btn::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(90deg, 
                      transparent 0%, 
                      var(--brand-color) 50%, 
                      transparent 100%);
          background-size: 200% auto;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          animation: ui-border-shimmer 4s linear infinite;
        }

        .ui-glass-btn:hover::after {
          opacity: 0.6;
        }

        @keyframes ui-border-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .ui-anim-letter {
          opacity: 0.85;
          transition: all 0.4s ease;
        }

        .ui-glass-btn:hover .ui-anim-letter {
          opacity: 1;
          color: #fff;
          text-shadow: 0 0 12px var(--brand-glow);
          transform: translateY(-1px);
        }

        .ui-glass-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Staggered text float */
        .ui-glass-btn:hover .ui-anim-letter {
          animation: ui-float 2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.05s);
        }

        @keyframes ui-float {
          0%, 100% { transform: translateY(-1px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
