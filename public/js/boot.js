/* Runs before first paint: mark JS as available so the mobile menu is never
   briefly rendered expanded (which caused a layout jump). Kept external for CSP. */
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
