var fs = require('fs');
var name = process.argv[2] || false;

if(!name){
  console.log('\n Missing component\'s name \n');
}
else{
  fs.mkdir('./src/components/'+name,function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      fs.appendFileSync('./src/components/'+name+'/_'+name+'.scss','.'+name+'{}');
      fs.appendFileSync('./src/components/'+name+'/'+name+'.js','');
      fs.appendFileSync('./src/components/'+name+'/sample.html','<div class="'+name+'"></div>');
    }
  });
}