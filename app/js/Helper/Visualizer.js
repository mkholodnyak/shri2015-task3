// По примеру с сайта Мозиллы
// https://developer.mozilla.org/ru/docs/Web/API/AudioContext/createAnalyser

var Visualizer = function (context) {
    this.analyser = context.createAnalyser();

    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.fftSize;
    this.data = new Uint8Array(this.bufferLength);
    this.analyser.getByteTimeDomainData(this.data);

    this.canvas = document.querySelector('#canvas');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.context = this.canvas.getContext('2d');

};

Visualizer.prototype.draw = function () {
    this.analyser.getByteTimeDomainData(this.data);

    this.drawPane();

    this.context.lineWidth = 2;
    this.context.strokeStyle = 'rgb(255, 255, 255)';

    this.context.beginPath();

    var sliceWidth = this.width / this.bufferLength;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) { 

        var v = this.data[i] / 256.0;
        var y = v * this.height / 2;

        if (i === 0) {
            this.context.moveTo(x, y);
        } else {
            this.context.lineTo(x, y);
        }

        x += sliceWidth;
    }

    this.context.lineTo(410, 400);
    this.context.stroke();
    requestAnimationFrame(this.draw.bind(this));
};

Visualizer.prototype.clean = function() {
  this.drawPane();
};

Visualizer.prototype.drawPane = function() {
    this.context.fillStyle = 'rgb(0,150, 136)';
    this.context.fillRect(0, 0, this.width, this.height);
};

module.exports = Visualizer;