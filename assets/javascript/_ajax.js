// AJAX (without jQuery)

// NOTE: currently in early stages of development

const ajax = {};



ajax.get = (name, url) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.onload = function() {
    xhr.status === 200 ? xhr.responseText : console.log(`Request failed.  Returned status of ${xhr.status}`);
  };

  xhr.send();
};

// Requires jQuery
// ajax.promiseGet = (name, url) => {
//   let get = $.ajax({type: 'GET', url: url});
//
//   get.resolve();
//   get.reject(xhr, status, err);
//
//   get.then(
//     function(data) {
//       console.log (data);
//     }, function (xhr, state err) {
//       console.log(arguments);
//     }
//   )
//
//   $.get(url)
//   .then(function(profile) {
//     return $.get(`something.json?${profile.id}`);
//   })
//   .then(function(profile) {
//     return $.get(`something.json?${profile.id}`);
//   .then(function(profile) {
//     return $.get(`something.json?${profile.id}`);
//   })
//
//   )
// }
