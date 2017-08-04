const data = {};



// Get Input
data.getInput = (id, clear = false, name) => {
  let input = document.getElementById('addItem').value;

  // save if name defined, else return
  if (typeof name !== 'undefined') {
    data.input[name] = input;
  } else {
    return input;
  }

  if (clear === true) document.getElementById(id).value = '';

  if (typeof id !== 'undefined') console.log('getInput() params... id, clear (default or flase to not clear, true to clear input), name (to save as property, leave empty to return)');
}



// Get Attribute
data.getAttribute = (id, attribute, name) => {
  let value = document.getElementById(id).getAttribute(attribute)

  if (typeof name !== 'undefined') {
    data.attribute[name] = value;
  } else {
    return value;
  }

  if (typeof id !== 'undefined') console.log('getAttribute() params... id of element, name of attribute, property name to save as (leave empty to return)');
}
