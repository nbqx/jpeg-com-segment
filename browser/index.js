var through = require('through2'),
    es = require('event-stream');

var com = require('../');

function load(){
  var fns = Array.prototype.slice.call(arguments),
      xhr = new XMLHttpRequest();

  xhr.open('GET', '/browser/test.jpg',true),
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(){
    if(this.status==200){
      var a = new Uint8Array(this.response);

      fns.forEach(function(f){
        f.apply(null,[a]);
      });
    }
  };
  xhr.send();
};

load(
  function renderImage(a){
    var blob = new Blob([a], {type:'image/jpeg'});
    var URL = window.URL || window.webkitURL,
        img = new Image();
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
  },
  function getComment(a){
    // `a` is not Buffer and cannot use `pipe` in browserify.
    var bf = (Buffer.isBuffer(a))? a : new Buffer(a);

    // buffer to stream
    es.readable(function(count,cb){
      this.emit('data',bf);
      this.emit('end');
      cb();
    })
      .pipe(com.read())
      .on('data',function(data){
        var comment = decodeURIComponent(data+''),
            elm = document.createElement('h1');
        elm.innerText = comment;
        document.body.appendChild(elm);
      })
  }
);

