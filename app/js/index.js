let $ = require('jQuery');

let UploadFormView = require('./View/UploadFormView.js'),
    PlayerView = require('./View/PlayerView.js'),
    ProgressView = require('./View/ProgressView.js'),
    PlayerModel = require('./Model/PlayerModel.js'),
    ProgressModel = require('./Model/ProgressModel.js');

var uploadForm = new UploadFormView({
    el: document.getElementById('js-upload-form'),
    highlightClass: 'drag-n-drop-zone_active'
});

var player = new PlayerView({
    el: document.getElementById('js-player'),
    model: new PlayerModel(),
    trackTitleSelector: '#js-track-title',
    playButtonSelector: '#js-play-button',
    playButtonStateSelectors: {
        play: 'icon-play',
        pause: 'icon-pause'
    }
});

var progressBar = new ProgressView({
    el: document.getElementById('js-progress'),
    model: new ProgressModel()
});

$('.player').on('dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
});