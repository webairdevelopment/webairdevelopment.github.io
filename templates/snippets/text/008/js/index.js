function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}document.querySelector('a').innerHTML = '<span>' + document.querySelector('a').innerHTML.split('').join('</span><span>') + '</span>';

[].concat(_toConsumableArray(document.querySelectorAll('span'))).forEach(function ($e) {
  $e.innerHTML = $e.innerHTML + ('<i>' + $e.innerHTML + '</i>').repeat(7);
});