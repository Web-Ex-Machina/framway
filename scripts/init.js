var path = require("path");
var fs = require('fs');

var appname = path.basename(path.resolve("./"));
fs.readFile('./webpack.config.js', function(err,data){
  var result = data.toString().replace(/publicPath: '.\/'/g, "publicPath: '/files/"+appname+"/build/'");

  fs.writeFile('./webpack.config.js', result, 'utf8', function (err) {
     if (err) throw err;
  });
})
