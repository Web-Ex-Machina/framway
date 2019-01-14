var fs = require('fs');
var name = process.argv[2] || false;

if(!name){
  console.log('\n Missing component\'s name \n');
}
else{
  json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  version = json.version;
  fs.mkdir('./src/components/'+name,function(err){
    if(err)
      console.log('\n'+err.message+'\n');
    else{
      var className = '';
      for (var i in name.split('-')) {
        className += name.split('-')[i].charAt(0).toUpperCase() + name.split('-')[i].slice(1);
      }
      fs.appendFileSync('./src/components/'+name+'/_'+name+'.scss','.'+name+'{}');
      fs.appendFileSync('./src/components/'+name+'/'+name+'.js',`var `+className+` = Object.getPrototypeOf(app).`+className+` = new Component("`+name+`");
`+className+`.debug = true;
`+className+`.createdAt      = "`+version+`";
`+className+`.lastUpdate     = "`+version+`";
`+className+`.version        = "1";
// `+className+`.loadingMsg     = "This message will display in the console when component will be loaded.";

// `+className+`.prototype.onCreate = function(){
  // do thing after element's creation
// }`);
      fs.appendFileSync('./src/components/'+name+'/sample.html','<div class="'+name+'"></div>');
    }
  });
}