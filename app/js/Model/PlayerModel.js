let _ = require('underscore'),
    Backbone = require('Backbone'),
    BufferLoader = require('./../Helper/BufferLoader.js'),
    Visualizer = require('./../Helper/Visualizer.js');

let PlayerModel = Backbone.Model.extend({
    defaults: {
        trackTitle: 'No track',
        playing: false,
        trackTime: 0
    },

    initialize: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.listenTo(Backbone, 'player:upload-form:upload', this.handleTrack);
    },

    handleTrack: function (track) {
        var self = this;
        this.clear();
        this.set('trackTitle', track.name);

        var url = URL.createObjectURL(track);
        var bufferLoader = new BufferLoader(
            this.context, url, self.start.bind(self)
        );

        bufferLoader.load();
    },

    getProgress: function () {
        var duration = this.get('duration'),
            trackTime = this.getTime();

        if (!duration) {
            return 0;
        }
        return trackTime / duration;
    },

    clear: function () {
        if (this.source) {
            this.source.stop(0);
            this.source = null;
        }


        this.stopInterval();
        this.set('trackTitle', 'No track');
        this.buffer = null;
        this.setTime(0);
        this.set('playing', false);
        if (this.visualizer) {
            this.visualizer.clean();
        }
        Backbone.trigger('player:player:progress', this.getProgress());
    },

    start: function (err, buffer) {
        if (err) {
            Backbone.trigger('player:player:error', err);
            return;
        }

        this.buffer = buffer;
        try {
            this.set('duration', buffer.duration);
            this.play();
        } catch (e) {
            Backbone.trigger('player:player:error', 'Ошибка чтения!');
        }
    },

    play: function (from) {

        this.prepareSource();
        this.setTime((!!+from) ? from : this.getTime());
        this.startTime = this.context.currentTime - (this.getTime() || 0);
        this.source.start(this.context.currentTime, this.getTime());
        this.startInterval();

        this.togglePlaying();
    },

    startInterval: function () {
        var self = this;
        this.interval = setInterval(function () {
            if (self.isPlaying()) {
                self.setTime(self.context.currentTime - self.startTime);
            } else {
                self.setTime(self.getTime());
            }

            if (self.get('duration') < self.getTime()) {
                self.stop();
            }
            Backbone.trigger('player:player:progress', self.getProgress());
        }, 100);
    },

    stopInterval: function () {
        clearInterval(this.interval);
    },

    setTime: function (time) {
        this.set('trackTime', time);
    },

    getTime: function () {
        return this.get('trackTime');
    },

    pause: function () {
        if (this.source) {
            this.source.stop(0);
            this.source = null;
            this.setTime(this.context.currentTime - this.startTime);
            this.stopInterval();

            this.togglePlaying();
        }
    },

    stop: function() {
        this.pause();
        this.clear();
    },

    toggle: function () {
        if (!this.hasBuffer()) {
            return;
        }

        if (this.isPlaying()) {
            return this.pause();
        }
        this.play(this.getTime());
    },

    togglePlaying: function () {
        var isPlaying = this.isPlaying();
        this.set('playing', !isPlaying);

        Backbone.trigger('player:player:playing', !isPlaying);
    },

    isPlaying: function () {
        return this.get('playing');
    },

    hasBuffer: function () {
        return !!this.buffer;
    },

    prepareSource: function () {
        this.visualizer = new Visualizer(this.context);
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.source.connect(this.visualizer.analyser);
        this.visualizer.draw();
    }
});

module.exports = PlayerModel;