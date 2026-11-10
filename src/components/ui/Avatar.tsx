/** Illustrated avatar (head & shoulders). Fixed size → no layout shift. */
export function Avatar({ size = 96, className = '', alt }: { size?: number; className?: string; alt: string }) {
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      <img src="/img/avatar.webp" width={size} height={size} alt={alt} decoding="async" />
    </span>
  );
}
