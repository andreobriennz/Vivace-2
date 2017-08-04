const update = {};

// Update HTML
update.html = (id, content, escapeChars = true) => {
  // escape all unless otherwse stated
  if (escapeChars !== false) content = e(content);

  document.getElementById(id).innerHTML = content;

  if (id === 'undefined') console.log('updateHTML() params... id of element, content/string, escapeChars: true (default) or false');
}



// Update Attribute
update.attribute = (id, attribute, content) => {
  document.getElementById(id).setAttribute(attribute, e(content));

  if (id === 'undefined') console.log('updateAttribute() params... id, name of attribute, new string for attrubte');
}
