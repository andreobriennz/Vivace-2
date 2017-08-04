// Vivace 2.0.0 pre-alpha - Updated 5 Aug 2017
const vivace = {};



vivace.entitys = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

// Escape Characters
const e = (string) => {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return vivace.entitys[s];
  });
}
