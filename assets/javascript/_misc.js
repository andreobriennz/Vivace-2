// Lazy Load
vivace.lazyLoad = (type = '', path, altTag = '') => {
  let el;

  switch (type) {
    case 'script':
      el = document.createElement('script');
      el.src = path;
      break;
    case 'link':
    case 'css':
      el = document.createElement('link');
      el.src = href;
      break;
    case 'image':
      el = document.createElement('img');
      el.src = path;
      el.setAttribute('alt', altTag);
      break;
    default:
      console.log('lazyLoad() params... type: (script, link or img). path: path to file. altTag: optional param for images.');
  }

  document.body.appendChild(el);
}
