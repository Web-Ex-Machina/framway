var shell = require('shelljs');
var fs = require('fs');

var arrBuildFiles = getFiles('./build/');
for (var i = 0; i < arrBuildFiles.length; i++) {
  shell.exec('git update-index --assume-unchanged '+arrBuildFiles[i]);
}
shell.exec('git stash');
shell.exec('git pull');
shell.exec('git stash pop');
for (var i = 0; i < arrBuildFiles.length; i++) {
  shell.exec('git update-index --no-assume-unchanged '+arrBuildFiles[i]);
}

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

