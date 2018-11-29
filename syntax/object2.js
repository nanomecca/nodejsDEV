var f = function () {
  console.log(1+1);
  console.log(1+3);
}
console.log(f);

var a = [f];
a[0]();


var o = {
  func:f
}

o.func();
