import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

const variantClasses = {
  default: "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--elevated)]",
  ghost:   "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)]",
  danger:  "text-[var(--text-secondary)] hover:text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.1)]",
};

export function IconButton({
  children,
  label,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: IconButtonProps): React.JSX.Element {
  return (
    <button
      aria-label={label}
      title={label}
      className={[
        "inline-flex items-center justify-center",
        "rounded-[var(--radius-sm)]",
        "orbit-no-drag orbit-focus-ring orbit-no-select",
        "transition-all duration-[var(--duration-fast)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}