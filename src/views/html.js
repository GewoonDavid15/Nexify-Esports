/** Minimal templating helpers. Interpolated strings are inserted as-is (trusted
 *  content from translations/config); always wrap user-provided data in esc(). */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function html(strings, ...values) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < values.length) {
      const v = values[i];
      if (v == null || v === false) return;
      out += Array.isArray(v) ? v.join('') : String(v);
    }
  });
  return out;
}
