/*
 * Homepage
 */

module.exports = function(app, dropbox){

  app.get('/', function(req, res){
    res.redirect('/login');
  });

}
