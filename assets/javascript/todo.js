window.onload = render.watch;

var app = {
  title: "Welcome",
  todo: [],
  // example function. returns what is passed to it
  speak: function (string) {
    return string;
  }
}



const addItem = () => {
  app.todo.push(
    $('#addItem').val()
  );
}
