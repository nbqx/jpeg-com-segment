var through = require('through2'),
    bfIndexOf = require('buffer-indexof'),
    bfsplit = require('buffer-split');

var com = new Buffer([0xff,0xfe]);

function zeroPad(hs,lm){
  var zero = '',
      maxLen = lm || 4; // => for 2bytes

  for(var i=maxLen; i>hs.length; i--){
    zero = zero + "0";
  }

  return zero + hs;
};

function read(){
  var cache = new Buffer([]);
  return through(function(chunk,enc,cb){
    chunk = Buffer.concat([cache,chunk]);
    var sp = bfsplit(chunk,com);
    if(sp.length!==1){
      var d = sp.pop(),
          slen = parseInt((d.slice(0,2)).toString('hex'), 16);
      this.push(d.slice(2,slen));
    }else{
      cache = chunk;
    }
    cb();
  });
};

function write(comment){
  var comment = encodeURIComponent(comment),
      size = Buffer.byteLength(comment,'ascii'),
      cache = new Buffer([]),
      eoi = new Buffer([0xff,0xd9]);

  if(size>65535){
    throw new Error('comment size too large');
  }

  return through(function(chunk,enc,cb){
    chunk = Buffer.concat([cache,chunk]);
    var epos = bfIndexOf(chunk,eoi);
    if(epos > 0){
      var sp = chunk.slice(0,epos),
          lc = new Buffer(zeroPad((size + 2).toString(16)),'hex'),
          strBuf = new Buffer(comment,'ascii'),
          buf = Buffer.concat([com,lc,strBuf]);
      this.push(Buffer.concat([sp,buf,eoi]));
    }else{
      cache = chunk;
    }

    cb();
  },function(cb){
    this.push(cache);
    cb();
  });
};

module.exports = {
  read: read,
  write: write
};
