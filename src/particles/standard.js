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
