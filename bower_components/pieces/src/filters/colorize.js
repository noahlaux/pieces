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
