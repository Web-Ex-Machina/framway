var shell = require('shelljs');
var path = require("path");
var fs = require('fs');


var arrBuildFiles = getFiles('./build/');
for (var i = 0; i < arrBuildFiles.length; i++) {
  arrBuildFiles[i]
  shell.exec('git update-index --skip-worktree '+arrBuildFiles[i]);
}
shell.exec('git update-index --skip-worktree webpack.config.js');
shell.exec('git update-index --skip-worktree framway.config.js');
shell.exec('git update-index --skip-worktree package-lock.json');
shell.exec('git update-index --skip-worktree src/scss/framway.scss');

// var appname = path.basename(path.resolve("./"));
// fs.readFile('./webpack.config.js', function(err,data){
  // var result = data.toString().replace(/publicPath: '.\/'/g, "publicPath: '/files/"+appname+"/build/'");

//   fs.writeFile('./webpack.config.js', result, 'utf8', function (err) {
//      if (err) throw err;
//   });
// })

/**
 * return an array of files contained in the given folder and its children.
 * @param  {String} path [path of the initial folder]
 * @return {Array}       [array of files with complete path]
 */
function getFiles(path){
  var result = [];
  var files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    if(fs.statSync(path+files[i]).isDirectory())
      result = result.concat(getFiles(path+files[i]+'/'));
    else
      result.push(path+files[i]);
  }
  return result;
}

