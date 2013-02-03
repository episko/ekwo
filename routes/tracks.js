/*
 * Retrieve tracks
 */

module.exports = function(app, dropbox){

  var _ = require('underscore');

  app.get('/tracks', function (req, res) {
    if (req.session.access_token) {
      var dropboxClient = dropbox.client(req.session.access_token);

      getTracksWithUrl({
        success: function(tracks) {
          res.json(tracks);
        }
      });

    } else res.json(403, { error: 'You must be authenticated with your dropbox account.' });

    function getTracks(options) {
      dropboxClient.search('./', ".mp3", function(status, files){
        var tracks = files.filter(function(file) {
          return file.mime_type === 'audio/mpeg';
        });
        if (options.success) options.success(tracks);
      });
    };

    function getTracksWithUrl(options) {
      getTracks({
        success: function(tracks) {
          tracks.forEach(function(track){
            dropboxClient.media(track.path, function(status, reply){
              track.url = reply.url;
              if (track === _(tracks).last()) {
                if (options.success) options.success(tracks);
              }
            });
          });
        }
      });
    };

  });

}
