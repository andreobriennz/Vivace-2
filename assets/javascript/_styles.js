// Toggle Class (without jQuery) - can use for hide/show, or with css fadein/fadeout classes
const toggleClass = (id, className) => {
  document.getElementById(id).classList.toggle(className);

  console.log('toggleClass() params... id, class to toggle');
}
