var fs = require('fs');

module.exports = function(app, dropbox){
  fs.readdirSync(__dirname + '/routes').forEach(function(file) {
    var name = file.substr(0, file.indexOf('.'));
    require('./routes/' + name)(app, dropbox);
  });
}
