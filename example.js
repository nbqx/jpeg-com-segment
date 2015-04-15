var fs = require('fs'),
    com = require('./');

// read COM segment comment
fs.createReadStream(__dirname+'/test/fixtures/with-comment.jpg')
  .pipe(com.read())
  .on('data',function(data){
    console.log(decodeURIComponent(data)+''); // => 'あいうえお'
  });

// write COM segment comment
var comment = 'あいうえお';
fs.createReadStream(__dirname+'/test/fixtures/test.jpg')
  .pipe(com.write(comment))
  .pipe(fs.createWriteStream('out.jpg'));

