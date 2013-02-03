$(document).ready(function() {

  Ekwo.Views.Player = Backbone.View.extend({
    el: '#player',

    initialize: function(options) {
      _.bindAll(this, 'playerPlay', 'playerPause', 'playerStop', 'loadTrack', 'syncState', 'play', 'pause', 'stop', 'render');
      this.$title = $('#current-track-title');
      this.$el.jPlayer({
        play: this.playerPlay,
        pause: this.playerPause,
        ended: this.playerStop,
        swfPath: "flash",
        supplied: "mp3"
      });
      this.model.on('change:currentTrack', this.loadTrack);
      this.model.on('change:state', this.syncState);
    },

    loadTrack: function() {
      this.$el.jPlayer("setMedia", {
        mp3: this.model.currentTrack().get('url'),
      });
      this.$title.text(this.model.currentTrack().get('title'));
      this.playerPlay();
      this.play();
    },

    // Sync silently view with model

    playerPlay: function(event) {
      this.model.set({ state: this.model.states.playing }, {silent: true});
    },

    playerPause: function(event) {
      // jPlayer does not trigger a stop event but a pause one when
      // clicking on stop, so compare with currentTime
      if (event.jPlayer.status.currentTime == 0)
        this.playerStop();
      else
        this.model.set({ state: this.model.states.paused }, {silent: true});
    },

    playerStop: function(event) {
      this.model.set({ state: this.model.states.stopped }, {silent: true});
    },

    // Sync model with view

    play: function() {
      this.$el.jPlayer('play');
    },

    pause: function() {
      this.$el.jPlayer('pause');
    },

    stop: function() {
      this.$el.jPlayer('stop');
    },

    syncState: function() {
      if (this.model.isPlaying()) this.play();
      if (this.model.isPaused()) this.pause();
      if (this.model.isStopped()) this.stop();
    },

    render: function() {
      return this;
    }

  });

  Ekwo.Views.LibraryHeader = Backbone.View.extend({
    template: _.template($("#library-header-template").html()),

    tagName: 'ul',
    className: 'list',
    id: 'library-header',

    render: function() {
      this.$el.html(this.template());
      return this;
    }

  });

  Ekwo.Views.Tracks = Backbone.View.extend({
    tagName: 'ul',
    className: 'list',
    id: 'tracks',

    initialize: function() {
      _.bindAll(this, 'renderTrack');
      this.collection.on('add', this.renderTrack);
    },

    renderTrack: function(track) {
      var childView = new Ekwo.Views.Track({ model: track });
      this.$el.append(childView.render().el);
    },

    render: function() {
      this.collection.each(this.renderTrack);
      return this;
    }

  });

  Ekwo.Views.Track = Backbone.View.extend({
    template: _.template($("#track-template").html()),

    tagName: 'li',
    className: 'track',

    events: {
      'click': 'playTrack'
    },

    initialize: function() {
      _.bindAll(this);
      this.model.on('change', this.render);
      Ekwo.player.on('change:currentTrack', this.toggleState);
    },

    playTrack: function() {
      Ekwo.player.load(this.model);
    },

    toggleState: function(){
      if (Ekwo.player.get('currentTrack') === this.model) this.$el.addClass('selected');
      else this.$el.removeClass('selected');
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()) );
      return this;
    }

  });

});
