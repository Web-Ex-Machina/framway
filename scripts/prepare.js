var fs = require('fs');
var config = require('../framway.config.js');
var strFramway = "/* Default configuration & mixins */\n"
               + "@import 'mixins';\n"
               + "@import 'vars';\n"
               + "@import 'config';\n";
var strEmails  = "/* Default configuration & mixins */\n"
               + "@import '../scss/mixins';\n"
               + "@import '../scss/vars';\n"
               + "@import '../scss/config';\n";
strFramway += "/* Themes configuration override */\n";
strEmails  += "/* Themes configuration override */\n";
for (var i = 0; i < config.themes.length; i++) {
    strFramway += "@import '../themes/"+config.themes[i]+"/config';\n";
    strEmails  += "@import '../themes/"+config.themes[i]+"/config';\n";
}

strFramway += "/* Core styles */\n"
            + "@import 'core';\n";
strEmails  += "/* Core styles */\n"
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

if(strEmails != fs.readFileSync('src/emails/emails.scss', 'utf8')){
    var streamEmail = fs.createWriteStream("src/emails/emails.scss");
    streamEmail.once('open', (fd) => {
        streamEmail.write(strEmails);
        // Important to close the stream when you're ready
        streamEmail.end();
    });
}