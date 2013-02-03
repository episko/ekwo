Ekwo.Models.Player = Backbone.Model.extend({

  states:  {
    playing: 1,
    paused: 0,
    stopped: -1
  },

  defaults: {
    currentTrack: null,
    state: -1
  },

  initialize: function() {
    _.bindAll(this);
  },

  // Alias
  currentTrack: function() {
    return this.get('currentTrack');
  },

  load: function(track) {
    this.set({ currentTrack: track });
  },

  play: function() {
    this.set({ state: this.states.playing });
  },

  stop: function() {
    this.set({ state: this.states.stopped });
  },

  pause: function() {
    this.set({ state: this.states.paused });
  },

  isPlaying: function() {
    return this.get('state') == this.states.playing;
  },

  isPaused: function() {
    return this.get('state') == this.states.paused;
  },

  isStopped: function() {
    return this.get('state') == this.states.stopped;
  }

});

Ekwo.Models.Track = Backbone.Model.extend({
  defaults: {
    artist: 'No artist',
    title: 'No title'
  },

  fetchID3: function(options) {
    var options = options || {};

    $.ajax({
      type: 'POST',
      url: '/id3',
      data: { url: this.get('url') },
      dataType: 'json',
      success: function(metadata) {
        this.set(metadata);
      }.bind(this),
      error: options.error
    });
  }

});

Ekwo.Collections.Tracks = Backbone.Collection.extend({
  model: Ekwo.Models.Track,
  url: '/tracks',

  fetchAllID3: function() {
    this.each(function(track) { track.fetchID3(); });
  }

});
