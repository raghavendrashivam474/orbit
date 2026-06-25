/**
 * BrowserLoading.tsx
 * Loading indicator shown while a page is loading.
 */

interface BrowserLoadingProps {
  progress: number;
}

export function BrowserLoading({ progress }: BrowserLoadingProps): React.JSX.Element {
  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div
        className="h-[2px] bg-[var(--color-primary)] transition-all duration-300"
        style={{ width: `${Math.max(progress * 100, 5)}%` }}
      />
    </div>
  );
}