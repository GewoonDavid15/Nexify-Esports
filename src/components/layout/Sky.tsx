/** Quiet background: a soft violet glow and a faint grid at the top. */
export function Sky() {
  return (
    <div className="sky" aria-hidden>
      <span className="sky__glow" />
      <span className="sky__grid" />
      <span className="sky__clouds" />
    </div>
  );
}
