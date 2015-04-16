## jpeg-com-segment

read/write COM segment in jpeg format.

## install

`$ npm install jpeg-com-segment`

or

`$ npm install https://github.com/nbqx/jpeg-com-segment.git`

## usage

```js
var fs = require('fs'),
    com = require('jpeg-com-segment');

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
```

and works in [browserify](http://browserify.org/). see detail in `browser/index.js`.

`$ npm install`

then

`$ npm run browser`

then see [http://127.0.0.1:9966](http://127.0.0.1:9966)

## tips

if you want to show COM comment, try `$ identify -verbose xxx.jpg`

