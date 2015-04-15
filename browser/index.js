var through = require('through2');
var com = require('../');

// ブラウザとnodeでbufferのよみこんだlengthがちがう

var dbg = function(){
  var buf = [];
  return through(function(chunk,enc,cb){
    // console.log(chunk);
    this.push(chunk);
    buf.push(chunk);
    cb();
  },function(cb){
    console.log(buf)
    cb();
  });
};

// var img = new Image();
// img.id = 'my-img';
// img.src = '/browser/test.jpg';
// document.body.appendChild(img);

// var xhr = new XMLHttpRequest();
// xhr.open('GET','/browser/test.jpg',true);
// xhr.responseType = 'arraybuffer';
// xhr.onload = function(){
//   if(this.status==200){
//     var a = new Uint8Array(this.response);
//     var blob = new Blob([a],{type: 'image/jpeg'});

//     var URL = window.URL || window.webkitURL;
//     var img =  new Image();
//     img.src = URL.createObjectURL(blob);
//     document.body.appendChild(img);
//   }
// };
// xhr.send();

var http = require('http');
var d = [],
    img = new Image();
http.get({path:'/browser/test.jpg'},function(res){
  res
    .pipe(com.read())
    // .pipe(dbg())
    .on('data',function(data){
      // console.log(data);
      // console.log(data+'');
    }).on('end',function(){
      // var a = new Uint8Array(d),
      //     blob = new Blob([a],{type:'image/jpeg'});
      // var URL = window.URL || window.webkitURL;
      // img.src = URL.createObjectURL(blob);
      // document.body.appendChild(img);
      console.log('end!');
    });
});

// no problem
// var b = new Buffer([0xff,0xfe]);
// console.log(b);
