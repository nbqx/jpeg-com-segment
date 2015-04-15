var test = require('tape'),
    colorize = require('tap-colorize');

var fs = require('fs'),
    com = require(__dirname+'/../');

test.createStream().pipe(colorize()).pipe(process.stdout);

var outJpg = [__dirname,'fixtures','out.jpg'].join('/'),
    comment = 'this is test!';

test('write',function(t){
  t.doesNotThrow(function(){
    fs.createReadStream(__dirname+'/fixtures/test.jpg')
      .pipe(com.write(comment))
      .pipe(fs.createWriteStream(outJpg).on('close',function(){
        t.end();
      }));
  });
});

test('huge size comment(over 65535 bytes) error when write',function(t){
  t.plan(1);
  var hugeTxt = (new Buffer(70000)).fill('a');
  t.throws(function(){
    com.write(hugeTxt.toString());
  });
});

test('read',function(t){
  fs.createReadStream(outJpg)
    .pipe(com.read())
    .on('data',function(data){
      t.equal(decodeURIComponent(data+''),comment);
    })
    .on('finish',function(){
      t.end();
    });
});
