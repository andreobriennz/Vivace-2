// Vivace 2.0.0 pre-alpha - Updated 3 Aug 2017
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

// AJAX (without jQuery)
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

// Get Input
const data = {};



data.getInput = (id, clear = false, name) => {
  let input = $('#addItem').val();

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
  let value = $(`#${id}`).attr(attribute);

  if (typeof name !== 'undefined') {
    data.attribute[name] = value;
  } else {
    return value;
  }

  if (typeof id !== 'undefined') console.log('getAttribute() params... id of element, name of attribute, property name to save as (leave empty to return)');
}

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


const render = {};



// Render array into list
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

  if (typeof parentId === 'undefined') console.log('renderList() params... id of list parent element, list array, element type (optional - default is div)');
}



// Render Everything
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
        console.log(`Unhandled type while attempting render.all()`);
    }
  }
}



const handleParams = (data, params) => {
  if (params.indexOf('raw') >= 0) return data;
}



const getBrackets = (string, start, end) => {

  start = string.indexOf(start) + start.length;
  end = string.indexOf(end);

  string = string.substring(start, end);

  return string;
}



const runFunction = (el, data, params) => {
  let brackets;

  if (params.indexOf('(') >= 0) {
    // if function has () get string inside
    brackets = getBrackets(params, '(', ')');
  }

  // if eval, save as js
  if (params.indexOf('eval') >= 0) brackets = eval(brackets);

  if (typeof(data(brackets) === 'string')) {
    // if returns string, update HTML. else run as function
    params.indexOf('raw') >= 0 ? el.innerHTML = data(brackets) : el.innerHTML = e(data(brackets));
  } else {
    data(brackets);
  }
}







// seperate function, can be called before or after or not at all
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



render.watch = () => {
  render.handlebars();

  render.all();

  watch(app, function(){
    render.all();
  });
}

// Toggle Class (without jQuery) - can use for hide/show, or with css fadein/fadeout classes
const toggleClass = (id, className) => {
  document.getElementById(id).classList.toggle(className);

  console.log('toggleClass() params... id, class to toggle');
}

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

/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE8*, IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 * For IE8 (and other legacy browsers) WatchJS will use dirty checking
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 *
 * LICENSE: MIT
 */

"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
        noMore: false,        // use WatchJS.suspend(obj) instead
        useDirtyCheck: false // use only dirty checking to track changes.
    },
    lengthsubjects = [];

    var dirtyChecklist = [];
    var pendingChanges = []; // used coalesce changes from defineProperty and __defineSetter__

    var supportDefineProperty = false;
    try {
        supportDefineProperty = Object.defineProperty && Object.defineProperty({},'x', {});
    } catch(ex) {  /* not supported */  }

    var isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var isObject = function(obj) {
        return {}.toString.apply(obj) === '[object Object]';
    };

    var getObjDiff = function(a, b){
        var aplus = [],
        bplus = [];

        if(!(typeof a == "string") && !(typeof b == "string")){

            if (isArray(a) && b) {
                for (var i=0; i<a.length; i++) {
                    if (b[i] === undefined) aplus.push(i);
                }
            } else {
                for(var i in a){
                    if (a.hasOwnProperty(i)) {
                        if(b && b[i] === undefined) {
                            aplus.push(i);
                        }
                    }
                }
            }

            if (isArray(b) && a) {
                for (var j=0; j<b.length; j++) {
                    if (a[j] === undefined) bplus.push(j);
                }
            } else {
                for(var j in b){
                    if (b.hasOwnProperty(j)) {
                        if(a && a[j] === undefined) {
                            bplus.push(j);
                        }
                    }
                }
            }
        }

        return {
            added: aplus,
            removed: bplus
        }
    };

    var clone = function(obj){

        if (null == obj || "object" != typeof obj) {
            return obj;
        }

        var copy = obj.constructor();

        for (var attr in obj) {
            copy[attr] = obj[attr];
        }

        return copy;

    }

    var defineGetAndSet = function (obj, propName, getter, setter) {
        try {
            Object.observe(obj, function(changes) {
                changes.forEach(function(change) {
                    if (change.name === propName) {
                        setter(change.object[change.name]);
                    }
                });
            });
        }
        catch(e) {
            try {
                Object.defineProperty(obj, propName, {
                    get: getter,
                    set: function(value) {
                        setter.call(this,value,true); // coalesce changes
                    },
                    enumerable: true,
                    configurable: true
                });
            }
            catch(e2) {
                try{
                    Object.prototype.__defineGetter__.call(obj, propName, getter);
                    Object.prototype.__defineSetter__.call(obj, propName, function(value) {
                        setter.call(this,value,true); // coalesce changes
                    });
                }
                catch(e3) {
                    observeDirtyChanges(obj,propName,setter);
                    //throw new Error("watchJS error: browser not supported :/")
                }
            }
        }
    };

    var defineProp = function (obj, propName, value) {
        try {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: value
            });
        } catch(error) {
            obj[propName] = value;
        }
    };

    var observeDirtyChanges = function(obj,propName,setter) {
        dirtyChecklist[dirtyChecklist.length] = {
            prop:       propName,
            object:     obj,
            orig:       clone(obj[propName]),
            callback:   setter
        }
    }

    var watch = function () {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }

    };


    var watchAll = function (obj, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if(isArray(obj)) {
            defineWatcher(obj, "__watchall__", watcher, level); // watch all changes on the array
            if (level===undefined||level > 0) {
                for (var prop = 0; prop < obj.length; prop++) { // watch objects in array
                   watchAll(obj[prop],watcher,level, addNRemove);
                }
            }
        }
        else {
            var prop,props = [];
            for (prop in obj) { //for each attribute if obj is an object
                if (prop == "$val" || (!supportDefineProperty && prop === 'watchers')) {
                    continue;
                }

                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    props.push(prop); //put in the props
                }
            }
            watchMany(obj, props, watcher, level, addNRemove); //watch all items of the props
        }


        if (addNRemove) {
            pushToLengthSubjects(obj, "$$watchlengthsubjectroot", watcher, level);
        }
    };


    var watchMany = function (obj, props, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        for (var i=0; i<props.length; i++) { //watch each property
            var prop = props[i];
            watchOne(obj, prop, watcher, level, addNRemove);
        }

    };

    var watchOne = function (obj, prop, watcher, level, addNRemove) {
        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if(isFunction(obj[prop])) { //dont watch if it is a function
            return;
        }
        if(obj[prop] != null && (level === undefined || level > 0)){
            watchAll(obj[prop], watcher, level!==undefined? level-1 : level); //recursively watch all attributes of this
        }

        defineWatcher(obj, prop, watcher, level);

        if(addNRemove && (level === undefined || level > 0)){
            pushToLengthSubjects(obj, prop, watcher, level);
        }

    };

    var unwatch = function () {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }

    };

    var unwatchAll = function (obj, watcher) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if (isArray(obj)) {
            var props = ['__watchall__'];
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
            unwatchMany(obj, props, watcher); //watch all itens of the props
        } else {
            var unwatchPropsInObject = function (obj2) {
                var props = [];
                for (var prop2 in obj2) { //for each attribute if obj is an object
                    if (obj2.hasOwnProperty(prop2)) {
                        if (obj2[prop2] instanceof Object) {
                            unwatchPropsInObject(obj2[prop2]); //recurs into object props
                        } else {
                            props.push(prop2); //put in the props
                        }
                    }
                }
                unwatchMany(obj2, props, watcher); //unwatch all of the props
            };
            unwatchPropsInObject(obj);
        }
    };


    var unwatchMany = function (obj, props, watcher) {

        for (var prop2 in props) { //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop2)) {
                unwatchOne(obj, props[prop2], watcher);
            }
        }
    };

    var timeouts = [],
        timerID = null;
    function clearTimerID() {
        timerID = null;
        for(var i=0; i< timeouts.length; i++) {
            timeouts[i]();
        }
        timeouts.length = 0;
    }
    var getTimerID= function () {
        if (!timerID)  {
            timerID = setTimeout(clearTimerID);
        }
        return timerID;
    }
    var registerTimeout = function(fn) { // register function to be called on timeout
        if (timerID==null) getTimerID();
        timeouts[timeouts.length] = fn;
    }

    // Track changes made to an array, object or an object's property
    // and invoke callback with a single change object containing type, value, oldvalue and array splices
    // Syntax:
    //      trackChange(obj, callback, recursive, addNRemove)
    //      trackChange(obj, prop, callback, recursive, addNRemove)
    var trackChange = function() {
        var fn = (isFunction(arguments[2])) ? trackProperty : trackObject ;
        fn.apply(this,arguments);
    }

    // track changes made to an object and invoke callback with a single change object containing type, value and array splices
    var trackObject= function(obj, callback, recursive, addNRemove) {
        var change = null,lastTimerID = -1;
        var isArr = isArray(obj);
        var level,fn = function(prop, action, newValue, oldValue) {
            var timerID = getTimerID();
            if (lastTimerID!==timerID) { // check if timer has changed since last update
                lastTimerID = timerID;
                change = {
                    type: 'update'
                }
                change['value'] = obj;
                change['splices'] = null;
                registerTimeout(function() {
                    callback.call(this,change);
                    change = null;
                });
            }
            // create splices for array changes
            if (isArr && obj === this && change !== null)  {
                if (action==='pop'||action==='shift') {
                    newValue = [];
                    oldValue = [oldValue];
                }
                else if (action==='push'||action==='unshift') {
                    newValue = [newValue];
                    oldValue = [];
                }
                else if (action!=='splice') {
                    return; // return here - for reverse and sort operations we don't need to return splices. a simple update will do
                }
                if (!change.splices) change.splices = [];
                change.splices[change.splices.length] = {
                    index: prop,
                    deleteCount: oldValue ? oldValue.length : 0,
                    addedCount: newValue ? newValue.length : 0,
                    added: newValue,
                    deleted: oldValue
                };
            }

        }
        level = (recursive==true) ? undefined : 0;
        watchAll(obj,fn, level, addNRemove);
    }

    // track changes made to the property of an object and invoke callback with a single change object containing type, value, oldvalue and splices
    var trackProperty = function(obj,prop,callback,recursive, addNRemove) {
        if (obj && prop) {
            watchOne(obj,prop,function(prop, action, newvalue, oldvalue) {
                var change = {
                    type: 'update'
                }
                change['value'] = newvalue;
                change['oldvalue'] = oldvalue;
                if (recursive && isObject(newvalue)||isArray(newvalue)) {
                    trackObject(newvalue,callback,recursive, addNRemove);
                }
                callback.call(this,change);
            },0)

            if (recursive && isObject(obj[prop])||isArray(obj[prop])) {
                trackObject(obj[prop],callback,recursive, addNRemove);
            }
        }
    }


    var defineWatcher = function (obj, prop, watcher, level) {
        var newWatcher = false;
        var isArr = isArray(obj);

        if (!obj.watchers) {
            defineProp(obj, "watchers", {});
            if (isArr) {
                // watch array functions
                watchFunctions(obj, function(index,action,newValue, oldValue) {
                    addPendingChange(obj, index, action,newValue, oldValue);
                    if (level !== 0 && newValue && (isObject(newValue) || isArray(newValue))) {
                        var i,n, ln, wAll, watchList = obj.watchers[prop];
                        if ((wAll = obj.watchers['__watchall__'])) {
                            watchList = watchList ? watchList.concat(wAll) : wAll;
                        }
                        ln = watchList ?  watchList.length : 0;
                        for (i = 0; i<ln; i++) {
                            if (action!=='splice') {
                                watchAll(newValue, watchList[i], (level===undefined)?level:level-1);
                            }
                            else {
                                // watch spliced values
                                for(n=0; n < newValue.length; n++) {
                                    watchAll(newValue[n], watchList[i], (level===undefined)?level:level-1);
                                }
                            }
                        }
                    }
                });
            }
        }

        if (!obj.watchers[prop]) {
            obj.watchers[prop] = [];
            if (!isArr) newWatcher = true;
        }

        for (var i=0; i<obj.watchers[prop].length; i++) {
            if(obj.watchers[prop][i] === watcher){
                return;
            }
        }

        obj.watchers[prop].push(watcher); //add the new watcher to the watchers array

        if (newWatcher) {
            var val = obj[prop];
            var getter = function () {
                return val;
            };

            var setter = function (newval, delayWatcher) {
                var oldval = val;
                val = newval;
                if (level !== 0
                    && obj[prop] && (isObject(obj[prop]) || isArray(obj[prop]))
                    && !obj[prop].watchers) {
                    // watch sub properties
                    var i,ln = obj.watchers[prop].length;
                    for(i=0; i<ln; i++) {
                        watchAll(obj[prop], obj.watchers[prop][i], (level===undefined)?level:level-1);
                    }
                }

                //watchFunctions(obj, prop);

                if (isSuspended(obj, prop)) {
                    resume(obj, prop);
                    return;
                }

                if (!WatchJS.noMore){ // this does not work with Object.observe
                    //if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                    if (oldval !== newval) {
                        if (!delayWatcher) {
                            callWatchers(obj, prop, "set", newval, oldval);
                        }
                        else {
                            addPendingChange(obj, prop, "set", newval, oldval);
                        }
                        WatchJS.noMore = false;
                    }
                }
            };

            if (WatchJS.useDirtyCheck) {
                observeDirtyChanges(obj,prop,setter);
            }
            else {
                defineGetAndSet(obj, prop, getter, setter);
            }
        }

    };

    var callWatchers = function (obj, prop, action, newval, oldval) {
        if (prop !== undefined) {
            var ln, wl, watchList = obj.watchers[prop];
            if ((wl = obj.watchers['__watchall__'])) {
                watchList = watchList ? watchList.concat(wl) : wl;
            }
            ln = watchList ? watchList.length : 0;
            for (var wr=0; wr< ln; wr++) {
                watchList[wr].call(obj, prop, action, newval, oldval);
            }
        } else {
            for (var prop in obj) {//call all
                if (obj.hasOwnProperty(prop)) {
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        }
    };

    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
    var defineArrayMethodWatcher = function (obj, original, methodName, callback) {
        defineProp(obj, methodName, function () {
            var index = 0;
            var i,newValue, oldValue, response;
            // get values before splicing array
            if (methodName === 'splice') {
               var start = arguments[0];
               var end = start + arguments[1];
               oldValue = obj.slice(start,end);
               newValue = [];
               for(i=2;i<arguments.length;i++) {
                   newValue[i-2] = arguments[i];
               }
               index = start;
            }
            else {
                newValue = arguments.length > 0 ? arguments[0] : undefined;
            }

            response = original.apply(obj, arguments);
            if (methodName !== 'slice') {
                if (methodName === 'pop') {
                    oldValue = response;
                    index = obj.length;
                }
                else if (methodName === 'push') {
                    index = obj.length-1;
                }
                else if (methodName === 'shift') {
                    oldValue = response;
                }
                else if (methodName !== 'unshift' && newValue===undefined) {
                    newValue = response;
                }
                callback.call(obj, index, methodName,newValue, oldValue)
            }
            return response;
        });
    };

    var watchFunctions = function(obj, callback) {

        if (!isFunction(callback) || !obj || (obj instanceof String) || (!isArray(obj))) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, obj[methodName], methodName, callback);
        }

    };

    var unwatchOne = function (obj, prop, watcher) {
        if (prop) {
            if (obj.watchers[prop]) {
                if (watcher===undefined) {
                    delete obj.watchers[prop]; // remove all property watchers
                }
                else {
                    for (var i=0; i<obj.watchers[prop].length; i++) {
                        var w = obj.watchers[prop][i];
                        if (w == watcher) {
                            obj.watchers[prop].splice(i, 1);
                        }
                    }
                }
            }
        }
        else
        {
            delete obj.watchers;
        }
        removeFromLengthSubjects(obj, prop, watcher);
        removeFromDirtyChecklist(obj, prop);
    };

    // suspend watchers until next update cycle
    var suspend = function(obj, prop) {
        if (obj.watchers) {
            var name = '__wjs_suspend__'+(prop!==undefined ? prop : '');
            obj.watchers[name] = true;
        }
    }

    var isSuspended = function(obj, prop) {
        return obj.watchers
               && (obj.watchers['__wjs_suspend__'] ||
                   obj.watchers['__wjs_suspend__'+prop]);
    }

    // resumes preivously suspended watchers
    var resume = function(obj, prop) {
        registerTimeout(function() {
            delete obj.watchers['__wjs_suspend__'];
            delete obj.watchers['__wjs_suspend__'+prop];
        })
    }

    var pendingTimerID = null;
    var addPendingChange = function(obj,prop, mode, newval, oldval) {
        pendingChanges[pendingChanges.length] = {
            obj:obj,
            prop: prop,
            mode: mode,
            newval: newval,
            oldval: oldval
        };
        if (pendingTimerID===null) {
            pendingTimerID = setTimeout(applyPendingChanges);
        }
    };


    var applyPendingChanges = function()  {
        // apply pending changes
        var change = null;
        pendingTimerID = null;
        for(var i=0;i < pendingChanges.length;i++) {
            change = pendingChanges[i];
            callWatchers(change.obj, change.prop, change.mode, change.newval, change.oldval);
        }
        if (change) {
            pendingChanges = [];
            change = null;
        }
    }

    var loop = function(){

        // check for new or deleted props
        for(var i=0; i<lengthsubjects.length; i++) {

            var subj = lengthsubjects[i];

            if (subj.prop === "$$watchlengthsubjectroot") {

                var difference = getObjDiff(subj.obj, subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        watchMany(subj.obj, difference.added, subj.watcher, subj.level - 1, true);
                    }

                    subj.watcher.call(subj.obj, "root", "differentattr", difference, subj.actual);
                }
                subj.actual = clone(subj.obj);


            } else {

                var difference = getObjDiff(subj.obj[subj.prop], subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        for (var j=0; j<subj.obj.watchers[subj.prop].length; j++) {
                            watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level - 1, true);
                        }
                    }

                    callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                }

                subj.actual = clone(subj.obj[subj.prop]);

            }

        }

        // start dirty check
        var n, value;
        if (dirtyChecklist.length > 0) {
            for (var i = 0; i < dirtyChecklist.length; i++) {
                n = dirtyChecklist[i];
                value = n.object[n.prop];
                if (!compareValues(n.orig, value)) {
                    n.orig = clone(value);
                    n.callback(value);
                }
            }
        }

    };

    var compareValues =  function(a,b) {
        var i, state = true;
        if (a!==b)  {
            if (isObject(a)) {
                for(i in a) {
                    if (!supportDefineProperty && i==='watchers') continue;
                    if (a[i]!==b[i]) {
                        state = false;
                        break;
                    };
                }
            }
            else {
                state = false;
            }
        }
        return state;
    }

    var pushToLengthSubjects = function(obj, prop, watcher, level){

        var actual;

        if (prop === "$$watchlengthsubjectroot") {
            actual =  clone(obj);
        } else {
            actual = clone(obj[prop]);
        }

        lengthsubjects.push({
            obj: obj,
            prop: prop,
            actual: actual,
            watcher: watcher,
            level: level
        });
    };

    var removeFromLengthSubjects = function(obj, prop, watcher){
        for (var i=0; i<lengthsubjects.length; i++) {
            var subj = lengthsubjects[i];

            if (subj.obj == obj) {
                if (!prop || subj.prop == prop) {
                    if (!watcher || subj.watcher == watcher) {
                        // if we splice off one item at position i
                        // we need to decrement i as the array is one item shorter
                        // so when we increment i in the loop statement we
                        // will land at the correct index.
                        // if it's not decremented, you won't delete all length subjects
                        lengthsubjects.splice(i--, 1);
                    }
                }
            }
        }

    };

    var removeFromDirtyChecklist = function(obj, prop){
        var notInUse;
        for (var i=0; i<dirtyChecklist.length; i++) {
            var n = dirtyChecklist[i];
            var watchers = n.object.watchers;
            notInUse = (
                n.object == obj
                && (!prop || n.prop == prop)
                && watchers
                && (!prop || !watchers[prop] || watchers[prop].length == 0 )
            );
            if (notInUse)  {
                // we use the same syntax as in removeFromLengthSubjects
                dirtyChecklist.splice(i--, 1);
            }
        }

    };

    setInterval(loop, 50);

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;
    WatchJS.suspend = suspend; // suspend watchers
    WatchJS.onChange = trackChange;  // track changes made to object or  it's property and return a single change object

    return WatchJS;

}));

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
