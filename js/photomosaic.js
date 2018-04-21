; (function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        window.Photomosaic = factory();
    }

})(function () {
    'use-strict';

    const defaults = {
        image: null,
        canvas: null,
        width: null,
        height: null,
        tileWidth: 15,
        tileHeight: 15,
        tileShape: 'circle', // circle || rectangle
        background: 'rgba(0, 0, 0, 0)',
        workerUrl: 'js/photomosaic.worker.js',
    };

    return class {
        constructor(options) {
            this.setOptions(options);
            this.registerWorker();
            this.render();
        }

        setOptions(options) {
            this.options = Object.assign({}, defaults, this.options, options);
        }

        registerWorker() {
            this.worker = new Worker(this.options.workerUrl);
            this.worker.onmessage = this.draw.bind(this);
        }

        getSize() {
            return {
                width: this.options.width || this.options.image.naturalWidth,
                height: this.options.height || this.options.image.naturalHeight,
            };
        }

        render() {
            if (!this.options.image || !this.options.canvas) return;

            var { width, height } = this.getSize();
            var { tileWidth, tileHeight } = this.options;
            var imageData = this.getImageData();
            
            this.worker.postMessage({
                width, height, tileWidth, tileHeight, imageData,
            });
        }

        getImageData() {
            var { width, height } = this.getSize();
            var { background, image } = this.options;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = background;
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.closePath();
            ctx.fill();
            ctx.drawImage(image, 0, 0, width, height);

            return ctx.getImageData(0, 0, width, height).data;
        }

        draw({ data }) {
            var { width, height } = this.getSize();

            this.options.canvas.width = width;
            this.options.canvas.height = height;

            for (let i = 0; i < data.length; i++) {
                this.drawMosaic(data[i]);
            }
        }

        drawMosaic(tile) {
            var { tileWidth, tileHeight, tileShape, canvas } = this.options;
            var centerX = tile.x + tileWidth / 2;
            var centerY = tile.y + tileHeight / 2;
            var radius = Math.min(tileWidth, tileHeight) / 2;
            var color = `rgba(${tile.r}, ${tile.g}, ${tile.b}, ${tile.a})`;
            var ctx = canvas.getContext('2d');

            ctx.fillStyle = color;
            ctx.beginPath();
            if (tileShape == 'circle') {
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            } else {
                ctx.rect(tile.x, tile.y, tileWidth, tileHeight);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
});