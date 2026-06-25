import { type ReactNode } from "react";

interface SurfaceProps {
  children: ReactNode;
  variant?: "base" | "elevated" | "panel";
  className?: string;
}

const variantClasses = {
  base:     "bg-[var(--bg)]",
  elevated: "bg-[var(--elevated)]",
  panel:    "orbit-panel",
};

export function Surface({
  children,
  variant = "base",
  className = "",
}: SurfaceProps): React.JSX.Element {
  return (
    <div className={[variantClasses[variant], className].join(" ")}>
      {children}
    </div>
  );
}