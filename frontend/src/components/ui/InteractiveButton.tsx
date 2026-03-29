import * as React from "react";
import AnimatedGenerateButton from "./animated-generate-button-shadcn-tailwind";

export type InteractiveButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  highlightHueDeg?: number; // Kept for API compatibility but defaulted in underlying component
  loading?: boolean;
};

export default function InteractiveButton({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
  highlightHueDeg = 245,
  loading = false,
}: InteractiveButtonProps) {
  return (
    <AnimatedGenerateButton
      className={className}
      labelIdle={children}
      labelActive={children} // Use same label or optional labelActive later
      generating={loading}
      highlightHueDeg={highlightHueDeg}
      onClick={onClick}
      type={type}
      disabled={disabled}
    />
  );
}
