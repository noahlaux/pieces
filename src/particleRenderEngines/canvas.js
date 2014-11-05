(function (namespace) {

     function RenderEngine(options) {
        /**
         * Reference to the rendering canvas
         * @type {HTML element}
         */
        this.canvas = this.getCanvas(options);

        /**
         * Reference to the rendering context
         * @type {Object}
         */
        this.buffer = this.canvas.getContext('2d');

        window.onresize = this.onResize.bind(this);
    }

    RenderEngine.prototype = {

        /**
         * [onTick description]
         * @return {[type]} [description]
         */
        onTick: function () {
            this.buffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        /**
         * [render description]
         * @param  {[type]} particle [description]
         * @return {[type]}          [description]
         */
        render: function (particle) {
            this.buffer.save();

            var offsetX = offsetY = -particle.size / 2;

            // Set position
            this.buffer.translate(particle.positionX - offsetX, particle.positionY - offsetY);

            // Set rotation
            this.buffer.rotate(particle.rotation);

            // Set opacity
            this.buffer.globalAlpha = particle.opacity;

            // Draw particle
            this.buffer.drawImage(particle.asset, offsetX, offsetY, particle.size, particle.size);

            this.buffer.restore();
        },

        getCanvas: function (config) {
            var canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            canvas.style.position = 'absolute';
            canvas.style.zIndex = config.zIndex || 0;
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.right = 0;
            canvas.style.bottom = 0;
            canvas.width = document.body.scrollWidth;
            canvas.height = document.body.scrollHeight;
            return canvas;
        },

        onResize: function () {
            this.canvas.width = document.body.scrollWidth;
            this.canvas.height = document.body.scrollHeight;
        }
    };

    namespace.particleRenderFactory.register('canvas', RenderEngine);

})(window.pieces || {});
