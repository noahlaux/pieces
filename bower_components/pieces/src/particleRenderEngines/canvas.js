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
         * React on emitters tick
         * @return N/A
         */
        onTick: function () {
            this.buffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        /**
         * Render particle
         * @param  {Object} particle
         * @return N/A
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

        /**
         * Return canvas for viewport rendering
         * @param  {Object} config
         * @return {HTML element}
         */
        getCanvas: function (config) {
            var canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            canvas.style.zIndex = config.zIndex || 0;
            // Disable click through
            canvas.style.pointerEvents = 'none';
            canvas.style.position = 'absolute';
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.right = 0;
            canvas.style.bottom = 0;
            canvas.width = document.body.scrollWidth;
            canvas.height = document.body.scrollHeight;
            return canvas;
        },

        /**
         * Fires on window resize
         * @return N/A
         */
        onResize: function () {
            this.canvas.width = document.body.scrollWidth;
            this.canvas.height = document.body.scrollHeight;
        },

        /**
         * Clean up
         * @return N/A
         */
        destroy: function () {
            this.buffer = undefined;
            this.canvas.remove();
        }
    };

    namespace.particleRenderFactory.register('canvas', RenderEngine);

})(window.pieces || {});
