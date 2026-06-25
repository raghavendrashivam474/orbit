interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  className = "",
}: DividerProps): React.JSX.Element {
  if (orientation === "vertical") {
    return (
      <div
        className={["orbit-divider-vertical", className].join(" ")}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <div
      className={["orbit-divider", className].join(" ")}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}