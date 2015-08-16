// Намернно не внедреяю AudioContext в этот модуль

// BufferLoader частично взят из книги Web Audio API, автор Boris Smus.
// В первоначальном файле передавался массив треков,
// изменил на единичный файл.

/**
 * Загрузчик файла. Отдаёт декодированный в аудио файл в callback
 *
 * @param {AudioContext} context
 * @param url
 * @param callback
 * @constructor
 */
var BufferLoader = function (context, url, callback) {
    this.context = context;
    this.url = url;
    this.buffer;
    this.callback = callback;
    this.loadCount = 0;
};

BufferLoader.prototype.loadBuffer = function (url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;

    request.onload = function () {
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (!buffer) {
                    loader.callback('error decoding file data: ' + url);
                    return;
                }
                loader.buffer = buffer;
                loader.callback(null, loader.buffer);
            },
            function (error) {
                loader.callback(error);
            }
        );
    };

    request.onerror = function () {
        this.callback('BufferLoader: XHR error');
    };

    request.send();
};

BufferLoader.prototype.load = function () {
        this.loadBuffer(this.url);
};

module.exports = BufferLoader;