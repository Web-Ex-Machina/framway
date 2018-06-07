var fs = require('fs');
var config = require('../framway.config.js');
var strFramway = "/* Default configuration & mixins */\n"
               + "@import 'mixins';\n"
               + "@import 'vars';\n"
               + "@import 'config';\n";
strFramway += "/* Themes configuration override */\n";
for (var i = 0; i < config.themes.length; i++) {
    strFramway += "@import '../themes/"+config.themes[i]+"/config';\n";
}
strFramway += "/* Core styles */\n"
            + "@import 'core';\n";
strFramway += "/* Components styles */\n";
for (var i = 0; i < config.components.length; i++) {
    strFramway += "@import '../components/"+config.components[i]+"/"+config.components[i]+"';\n";
}
strFramway += "/* Themes styles override */\n";
for (var i = 0; i < config.themes.length; i++) {
    strFramway += "@import '../themes/"+config.themes[i]+"/"+config.themes[i]+"';\n";
}

if(strFramway != fs.readFileSync('src/scss/framway.scss', 'utf8')){
    var stream = fs.createWriteStream("src/scss/framway.scss");
    stream.once('open', (fd) => {
        stream.write(strFramway);
        // Important to close the stream when you're ready
        stream.end();
    });
    console.log('\n ---------------- \n framway rewrited \n ---------------- \n');
} else {
    console.log('\n -------------------- \n framway not rewrited \n -------------------- \n');
}
