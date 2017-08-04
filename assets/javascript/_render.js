const render = {};



render.watch = () => {
  render.handlebars();

  render.all();

  watch(app, function(){
    render.all();
  });
}



// Replace {var} with string
render.handlebars = () => {
  let html = document.getElementById('app').innerHTML;

  let occurs = html.replace(/[^{]/g, "").length; // number of times { occurs
  for (var i = 0; i < occurs; i++) {
      var string = getBrackets(
        html, '{', '}'
      );
      html = html.replace(`{${string}}`, app[string]);
  }

  document.getElementById('app').innerHTML = html;
}



// Render Everything (needs refactor)
render.all = () => {
  // get all elements with data-v attribute
  var elements = document.querySelectorAll('[data-v]');

  for (var i = 0; i < elements.length; i++) {
    let el = elements[i];

    // get variable from attribute
    let data = el.getAttribute("data-v");

    // Seperate pipe params form variable
    if (data.indexOf("|") >= 0) {
      data = data.split("|");
      var params = data[1];
      data = data[0];
    }
    data = app[data];

    switch (typeof(data)) {
      case 'string':
        // handle params
        typeof(params) === 'string' ? data = handleParams(data, params) : data = e(data);

        // if raw dont escape html
        el.innerHTML = data;
        break;
      case 'object':
      case 'array': // render.list (parentId, list, el = 'div')
        let escapeHTML = true;
        if (typeof(params) === 'string' && params.indexOf('raw') >= 0) escapeHTML = false;
        render.list(el.id, data, 'div', escapeHTML);
        break;
      case 'function':
        runFunction(el, data, params);
        break;
      default:
        console.log(`render.all() type error`);
    }
  }
}



// Return String Between Characters (eg () or {} )
const getBrackets = (string, start, end) => {
  start = string.indexOf(start) + start.length;
  end = string.indexOf(end);

  string = string.substring(start, end);

  return string;
}



// Render Array Into List
render.list = (parentId, list, el = 'div', escapeHTML = true) => {
  let html = '';
  let item;

  for (var i = 0; i < list.length; i++) {
    item = list[i];
    if (escapeHTML !== false) item = e(item);

    html += `
    <${el}>
      ${item}
    </${el}>`;
  }

  document.getElementById(parentId).innerHTML = html;

  if (typeof parentId === 'undefined') console.log('renderList() Requies: parentId, list array. Optional: el type, escapeHTML');
}



// Handle function passed in attribute
const runFunction = (el, data, params) => {
  let brackets;

  // if function has () get string inside
  if (params.indexOf('(') >= 0) brackets = getBrackets(params, '(', ')');

  // if eval, save as js
  if (params.indexOf('eval') >= 0) brackets = eval(brackets);

  // if not raw then escape html
  if (params.indexOf('raw') >= 0) brackets = e(brackets);

  // if returns string, update HTML. else run as function
  typeof(data(brackets) === 'string') ? el.innerHTML = data(brackets) : data(brackets);
}



// may be depreciated
const handleParams = (data, params) => {
  if (params.indexOf('raw') >= 0) return data;
}
