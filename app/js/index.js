let $ = require('jQuery');

let UploadFormView = require('./View/UploadFormView.js'),
    PlayerView = require('./View/PlayerView.js'),
    PlayerModel = require('./Model/PlayerModel.js');


var uploadForm = new UploadFormView({
    el: document.getElementById('js-upload-form'),
    highlightClass: 'drag-n-drop-zone_active'
});

var player = new PlayerView({
    el: document.getElementById('js-player'),
    model: new PlayerModel(),
    trackTitleClass: '#js-track-title'
});

$('*').on('dragover dragenter dragleave drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
});