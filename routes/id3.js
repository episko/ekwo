/*
 * Retrieve ID3 of a track
 */

module.exports = function(app, dropbox){

  var ID3 = require('id3')
    , url = require('url')
    , https = require('https');

  app.post('/id3', function (req, res) {
    if (req.session.access_token) {
      var dropboxClient = dropbox.client(req.session.access_token);
      var source = req.body.url;

      getBuildID3({
        source: source,
        success: function(metadata) {
          res.json(metadata);
        }
      });

    } else res.json(403, { error: 'You must be authenticated with your dropbox account.' });

    function getBuildID3(options) {
      var result = {};

      getID3({
        source: options.source,
        success: function(metadata) {
          metadata.parse();
          result.artist = metadata.get('artist');
          result.title = metadata.get('title');
          if (options.success) options.success(result);
        }
      });
    };

    /*
     * Optimization: Reads the first 4096 bytes of the file
     * Note: Works with ID3v2, but not ID3v1 (as it doesn't have the metadata at the beginning of the file)
     */
    function getID3(options) {
      var source = url.parse(options.source);

      https.get(source, function(res){
        var chunks = [],
            totalLength = 0;

        res.on('data', function(chunk){
          chunks.push(chunk);
          totalLength += chunk.length;
          if (totalLength >= 4096) res.emit('end');
        });

        res.on('end', function () {
          var file = Buffer.concat(chunks, totalLength);
          if (options.success) options.success(new ID3(file));
        });
      }).on('error', function(e){
        console.error(e);
      });

    };

  });

}
