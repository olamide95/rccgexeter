/* Inline SVG path sets — keeps the bundle free of an icon dependency. */
export const ICONS = {
  home:   '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
  people: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  heart:  '<path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/>',
  book:   '<path d="M3 20V7l9-3 9 3v13"/><path d="M12 4v16"/>',
  music:  '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  cross:  '<path d="M12 3v18"/><path d="M5 9h14"/><path d="M7 21h10"/>',
  bag:    '<path d="M4 7h16v13H4z"/><path d="M8 7V4h8v3"/><path d="M4 12h16"/>',
  globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 4 3 14 0 18"/>',
  camera: '<path d="M3 7h13v10H3z"/><path d="M16 10l5-3v10l-5-3"/>',
  flag:   '<path d="M12 2v20"/><path d="M12 4l9 4-9 4"/>',
  couple: '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M12 20c0-3 2.7-5 6-5s4 2 4 5"/>',
  pin:    '<path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  phone:  '<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  mail:   '<path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/>'
};
export function icon(name) { return ICONS[name] || ICONS.home; }
