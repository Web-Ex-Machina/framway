var fs = require('fs');
var name = process.argv[2] || false;

if(!name){
  console.log('\n Missing theme\'s name \n');
}
else{
  fs.mkdir('./src/themes/'+name,function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      fs.copyFileSync('./src/scss/_config.scss','./src/themes/'+name+'/_config.scss');
      fs.appendFileSync('./src/themes/'+name+'/_'+name+'.scss','');
      fs.appendFileSync('./src/themes/'+name+'/'+name+'.js','$(function(){\n\n});');
    }
  });
}