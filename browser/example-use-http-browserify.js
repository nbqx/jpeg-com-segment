// example: use http-browserify

var http = require('http'),
    stream = require('stream'),
    through = require('through2'),
    es = require('event-stream'),
    com = require('../'),
    tee = require('tee-stream');

var opts = {
  path: '/browser/test.jpg',
  responseType: 'arraybuffer'
};

function request(){
  var st = new stream.Readable();
  st._read = function(){};

  http.get(opts, function(res){
    res
      .on('data', function(data){
        var a = new Uint8Array(data),
            bf = new Buffer(a);
        st.push(bf);
      }).on('end', function(){
        st.push(null);
      });
  });

  return st;
};

function appendImg(){
  var st = new stream.Writable();
  st._write = function(data,enc,cb){
    var blob = new Blob([data],{type:'image/jpeg'}),
        URL = window.URL || window.webkitURL,
        img = new Image();
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
    cb();
  };
  return st;
};

function appendComment(){
  var st = new stream.Writable();
  st._write = function(data,enc,cb){
    var comment = decodeURIComponent(data+''),
        elm = document.createElement('h1');
    elm.innerText = comment;
    document.body.appendChild(elm);
  };
  return st;
};

request()
  .pipe(tee(appendImg()))
  .pipe(com.read())
  .pipe(appendComment());

