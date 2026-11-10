/** Fixed atmospheric background: aurora blobs, purple clouds, stars, grain. */
export function Sky() {
  return (
    <div className="sky" aria-hidden>
      <span className="aurora aurora--1" />
      <span className="aurora aurora--2" />
      <span className="aurora aurora--3" />
      <span className="sky__clouds" />
      <span className="sky__stars" />
      <span className="sky__grain" />
    </div>
  );
}
