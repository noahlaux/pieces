(function () {

    window.pieces = {};

    var namespace = window.pieces;

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    /**
     * Holds particle render prototypes
     * @type {Object}
     */
    namespace.particleRenderFactory = {
        renderEngines: {},
        register: function (name, renderEngine) {
            this.renderEngines[name] = renderEngine;
        },

        /**
         * Get render engine prototype
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.renderEngines[name];
        }
    };

    /**
     * Holds particle prototypes
     * @type {Object}
     */
    namespace.particleFactory = {
        particles: {},
        register: function (name, particle) {
            this.particles[name] = particle;
        },

        /**
         * Get particle prototype
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.particles[name];
        }
    };

    /**
     * Filter factory
     * @type {Object}
     */
    namespace.filterFactory = {

        /**
         * Currently available filters
         * @type {Object}
         */
        filters: {},

        /**
         * Applies provided filters to an image
         * @param  {HTML element}   image to be filtered
         * @param  {Object}         filters filters with settings
         * @return {HTML element}   filtered image
         */
        applyFilters: function (image, filters) {

            var buffer = this.getImageBuffer(image.width, image.height);
            buffer.getContext('2d').drawImage(image, 0, 0);

            for (var filterName in filters) {
                var filter = this.get(filterName);
                if (filter) {
                    var options = filters[filterName];
                    buffer = filter.call(this, buffer, options);
                }
            }
            var newImage = new Image();
            newImage.src = buffer.toDataURL('image/png', 1);
            return newImage;
        },

        /**
         * Register a new filter
         * @param  {String} name        Name of the filter
         * @param  {Function} filter    filter function
         * @return N/A
         */
        register: function (name, filter) {
            this.filters[name] = filter;
        },

        /**
         * Get filter by name
         * @param  {String} name
         * @return {Function}
         */
        get: function (name) {
            return this.filters[name];
        },

        /**
         * Creates a canvas as a buffer
         * @param  {Number} width  Width of buffer
         * @param  {Number} height Height of buffer
         * @return {HTML element}
         */
        getImageBuffer: function (width, height) {
            var buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;
            return buffer;
        },

        generateRGBKs: function (image) {
            var width = image.width;
            var height = image.height;
            var rgbks = [];

            var canvas = this.getImageBuffer(width, height);

            var ctx = canvas.getContext("2d");
            ctx.drawImage( image, 0, 0 );

            var pixels = ctx.getImageData( 0, 0, width, height ).data;

            // 4 is used to ask for 3 images: red, green, blue and
            // black in that order.
            for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
                var buffer = this.getImageBuffer(width, height);

                var ctx = canvas.getContext('2d');
                ctx.drawImage( image, 0, 0 );
                var to = ctx.getImageData( 0, 0, width, height );
                var toData = to.data;

                for (
                        var i = 0, len = pixels.length;
                        i < len;
                        i += 4
                ) {
                    toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                    toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                    toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                    toData[i+3] =                pixels[i+3]    ;
                }

                ctx.putImageData( to, 0, 0 );

                // image is _slightly_ faster then canvas for this, so convert
                var imgComp = new Image();
                imgComp.src = canvas.toDataURL();

                rgbks.push( imgComp );
            }

            return rgbks;
        },
    };
})();

(function (namespace) {
    namespace.utils = {
        deepExtend: function (destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    arguments.callee(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        isEmpty: function (obj) {
            return Object.keys(obj || {}).length === 0;
        },

        /**
         * Load asset
         * @param  {String}   src URL or Base64
         * @param  {Function} cb  fired when image is ready
         */
        loadAsset: function (src, cb) {
            var image = new Image();

            image.src = src;

            image.onload = function () {
                cb(image);
            };
        }
    };
})(window.pieces || {});

(function (namespace) {

    /**
     * Defaults settings for emitter
     * @type {Object}
     */
    var defaults = function () {
        return {

            /**
             * Render used for particles
             * @type {String}
             */
            render: 'canvas',

            /**
             * Particle prototype
             * @type {String}
             */
            particleName: 'standard',

            /**
             * Time between emitter spawns
             * @type {Number}
             */
            spawnInterval: 40,

            /**
             * Indicates if emitter should spawn particles
             * @type {Boolean}
             */
            paused: false,

            /**
             * Filters to apply to asset
             * @type {Object}
             */
            filters: {},

            maxLifeTime: 5000,
            size: 0,
            lifeTime: 0,
            startSize: 30,
            endSize: 70,
            growFactor: 0.1,
            positionX: 0,
            positionY: 0,
            velocityX: 1,
            velocityXRandomFactor: 0.5,
            velocityY: 1,
            velocityYRandomFactor: 3,
            rotationAngleSpan: 180,
            rotationSpeed: 0.2,
            startOpacity: 1,
            opacityDeclineSpeed: 0.01,

            /**
             * Image to use for asset
             * @type {String}
             */
            image: 'data:image/png;base64,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'

        };
    };

    function Emitter(config) {


        /**
         * Settings
         * @type {Object}
         */
        this.settings = namespace.utils.deepExtend(defaults(), config);

        /**
         * Reference to the particle prototype
         * @type {Function}
         */
        this.ParticlePrototype = namespace.particleFactory.get(this.settings.particleName);

        /**
         * Reference to the last time the emitter was spawned
         * @type {Date}
         */
        this.lastTime = null;

        /**
         * Render engine prototype
         * @type {[type]}
         */
        var RenderEngine = namespace.particleRenderFactory.get(this.settings.render);

        /**
         * Render engine for emitter
         * @type {renderEngine}
         */
        this.renderEngine = new RenderEngine(this.settings);

        /**
         * Holds the current particles spawn by the emitter
         * @type {Array}
         */
        this.particles = [];

        //this.settings.maxLifeTime = Math.min(this.settings.maxLifeTime, (this.canvas.height / (1.5 * 60) * 1000));

        namespace.utils.loadAsset(this.settings.image, function (asset) {
            if (!namespace.utils.isEmpty(this.settings.filters)) {
                asset = namespace.filterFactory.applyFilters(asset, this.settings.filters);
            }
            this.settings.asset = asset;
            this.tick(this.settings);
        }.bind(this));

    }

    Emitter.prototype = {

        /**
         * Spawns a particle
         * @param  {Object} config settings for particle
         * @return
         */
        spawn: function (config) {
            // Set last time for spawn
            this.lastTime = this.lastTime || new Date().getTime();

            var now = new Date().getTime();

            if (!this.settings.paused && now > this.lastTime + this.settings.spawnInterval) {
                var particle = new this.ParticlePrototype(config);
                this.particles.push(particle);
                this.lastTime = now;
            }
        },

        /**
         * Fires on each emitter tick
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        tick: function (config) {

            // Notice render engine
            this.renderEngine.onTick();

            var length = this.particles.length;

            while (length--) {
                var particle = this.particles[length];

                if (particle.isDead()) {
                    this.removeParticle(particle);
                } else {
                    particle.tick();
                    this.renderEngine.render(particle);
                }
            }

            this.spawn(config);
            requestAnimationFrame(function () {
                this.tick(config);
            }.bind(this));
        },

        /**
         * Removes provided particle
         * @param  {Particle} particle to be removed
         * @return {Particle} Removed particle
         */
        removeParticle: function (particle) {
            var index = this.particles.indexOf(particle);
            if (index > -1) {
                return this.particles.splice(index, 1);
            }
        },

        /**
         * Starts emitter
         * @return N/A
         */
        start: function () {
            this.settings.paused = false;
        },

        /**
         * Stops emitter
         * @return N/A
         */
        stop: function () {
            this.settings.paused = true;
        }
    };

    namespace.Emitter = Emitter;

})(window.pieces || {});

(function (namespace) {
    namespace.filterFactory.register('colorize', function (buffer, options) {

        var width = buffer.width;
        var height = buffer.height;

        var fill = options.colors.concat(options.strength || 1);

        var render = this.getImageBuffer(width, height);
        var ctx = render.getContext('2d');

        ctx.fillStyle = 'rgba(' + fill.join(',') + ')';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(buffer, 0, 0);

        return render;
    });
})(window.pieces || {});

(function (namespace) {
    namespace.filterFactory.register('desaturate', function (buffer, options) {

        var context = buffer.getContext('2d'),
            imageData = context.getImageData(0, 0, buffer.width, buffer.height),
            data = imageData.data,
            len = imageData.width * imageData.height * 4,
            index = 0,
            average;

        while (index < len) {
            average = (data[index] + data[index + 1] + data[index + 2]) / 3;
            data[index]     = average;
            data[index + 1] = average;
            data[index + 2] = average;
            index += 4;
        }

        context.putImageData(imageData, 0, 0);

        return buffer;
    });
})(window.pieces || {});

(function (namespace) {
    namespace.filterFactory.register('tint', function (buffer, options) {

        var ctx  = buffer.getContext("2d");
        var rgbks = this.generateRGBKs(buffer);

        var red = options.colors[0] || 0;
        var green = options.colors[1] || 0;
        var blue = options.colors[2] || 0;

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'copy';
        ctx.drawImage( rgbks[3], 0, 0 );

        ctx.globalCompositeOperation = 'lighter';
        if ( red > 0 ) {
            ctx.globalAlpha = red   / 255.0;
            ctx.drawImage( rgbks[0], 0, 0 );
        }
        if ( green > 0 ) {
            ctx.globalAlpha = green / 255.0;
            ctx.drawImage( rgbks[1], 0, 0 );
        }
        if ( blue > 0 ) {
            ctx.globalAlpha = blue   / 255.0;
            ctx.drawImage( rgbks[2], 0, 0 );
        }

        return buffer;
    });
})(window.pieces || {});


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

        /**
         * Fires on window resize
         * @return N/A
         */
        onResize: function () {
            this.canvas.width = document.body.scrollWidth;
            this.canvas.height = document.body.scrollHeight;
        }
    };

    namespace.particleRenderFactory.register('canvas', RenderEngine);

})(window.pieces || {});

(function (namespace) {

    function Particle(config) {

        namespace.utils.deepExtend(this, config);

        this.startLife = new Date().getTime();
        this.angle = Math.random() * 359;

        this.velocityY = this.velocityY - (Math.random() * this.velocityYRandomFactor);
        this.velocityX = Math.random() * this.velocityXRandomFactor / this.velocityX;
    }

    Particle.prototype = {
        tick: function () {

            this.lifeTime = new Date().getTime() - this.startLife;
            this.angle += this.rotationSpeed;

            var lifePerc = ((this.lifeTime / this.maxLifeTime) * 100);

            // Calculate size
            this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * this.growFactor);

            // Calculate opacity
            this.opacity = Math.max(this.startOpacity - (lifePerc * this.opacityDeclineSpeed), 0);

            // Calculate rotation
            this.rotation = this.angle / this.rotationAngleSpan * Math.PI;

            // Update position
            this.positionX += this.velocityX;
            this.positionY += this.velocityY;
        },

        /**
         * Check if particle is dead
         * @return {Boolean}
         */
        isDead: function () {
            // kill particle if it's offscreen or life span is over
            return (this.positionY < (0 - this.size)) || this.lifeTime > this.maxLifeTime;
        }
    };

    namespace.particleFactory.register('standard', Particle);

})(window.pieces || {});

(function (namespace) {

    function EmitterElement (element, options) {

        /**
         * Reference to element
         * @type {HTML element}
         */
        this.element = element;

        /**
         * Emitter bound to element
         * @type {Emitter}
         */
        this.emitter = new namespace.Emitter(options);

        // Set initial position
        this.setPosition(this.getPosition(this.element));

         // When element position changes, change position on emitter
        this.observeElement(this.element, function () {
            this.setPosition(this.getPosition(this.element));
        }.bind(this));
    }

    EmitterElement.prototype = {
        /**
         * Observes element on changes
         * @param  {HTML element}   element
         * @param  {Function} callback
         * @return N/A
         */
        observeElement: function (element, callback) {
            var observer = new MutationObserver(callback);
            observer.observe(element, { attributes: true, characterData: true });
        },

        /**
         * Get position of attached element
         * @param  {HTML element} element
         * @return {Object} { top: Number, left: Number }
         */
        getPosition: function (element) {

            var transform = element.style.getPropertyCSSValue('transform'),
                transformY = 0,
                transformX = 0;

            if (transform) {
                var compensation = transform[0];
                transformX = parseInt(compensation[0].cssText, 10);
                transformY = parseInt(compensation[1].cssText, 10);
            }

            return {
                top: element.offsetTop + transformY,
                left: element.offsetLeft + transformX
            };
        },

        /**
         * Sets position of emitter
         * @param {Object} position @example { top: 0, left: 0 }
         */
        setPosition: function (position) {
            this.emitter.settings.positionX = position.left;
            this.emitter.settings.positionY = position.top;
        }
    };

    namespace.EmitterElement = EmitterElement;

})(window.pieces || {});
