window.onload = render.watch;

var app = {
  title: "Welcome",
  todo: [],
  speak: function (words) {
    // console.log(words);
    return words;
  }
}

var var1 = 'teeest';



const addItem = () => {
  app.todo.push(
    $('#addItem').val()
  );
}
