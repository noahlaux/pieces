# PIECES.JS
pieces.js is a small modular library (7KB) that spawn emitters and other goodness.

---

## Example

Check `example.html` in root folder for a demontration.

---

## Packaged Builds
The easiest way to use `pieces.js` in your code is by using the built source at `dist/pieces.min.js`. These built JavaScript files bundle all the necessary dependencies to run pieces.js.

In your `head` tag, include the following code:
```html
<script type="text/javascript" src="pieces.min.js"></script>
```

----

## EmitterElement

An `EmitterElement` is used to bind an emitter to a HTML element, making the emitter track the position of your HTML element and follow along. This is quite powerful and very easy to do:

```html
<!-- Element to be tracked -->
<div id="smokeMachine"></div>

<script>
    // Reference to element
    var element = document.getElementById('smokeMachine');

    // create emitter element with default settings
    var emitterElement = new pieces.EmitterElement(element);
</script>
```

From now on the emitter tracks the position of the HTML element `smokeMachine` and will follow it around on your screen!

You can also provide additional options for your emitter by passing in some options
```html
<!-- Element to be tracked -->
<div id="smokeMachine"></div>

<script>
    // Reference to element
    var element = document.getElementById('smokeMachine');

    // create emitter element with options
    var emitterElement = new pieces.EmitterElement(element, {
        endSize: 100,
        velocityX: 4
    });
</script>
```

## Emitter
An emitters job is to spawn particles. This is useful to create illusions of fx smoke, fire, water, stars etc.

Creating an emitter in pieces.js is easy
```js
var emitter = new pieces.Emitter();
```
This creates an emitter that imidiatly starts emitting smoke in the top left corner of your screen. The emitter has some sensible default settings and have an base64 smoke asset embedded.

There's quite a few options to control the appearence of your emitter. Let's make a smoke hurricane for the fun of it:
```js
// smoke hurricane
var smokeHurricane = new pieces.Emitter({
    rotationSpeed: 5,
    spawnInterval: 20,
    growFactor: 0.3
});
```

If you want to go completely crazy there's also filters (`desaturate`, `colorize`, `tint`) that you can color your particle asset. You use them like this:
```js
// Green dense smoke
var smokeHurricane = new pieces.Emitter({
    growFactor: 5
    filters: {
        colorize: {
            // RGB colors
            colors: [0, 255, 0]
            // opacity of filter
            strength: 1
        }
    }
});
```

### Emitter options
```js
var defaults = {
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
     * Max life time for particle to live (in ms)
     * @type {Number}
     */
    maxLifeTime: 5000,

    /**
     * Current size of particle
     * @type {Number}
     */
    size: 0,

    /**
     * Initial and current life time of particle
     * @type {Number}
     */
    lifeTime: 0,

    /**
     * Start size of particle
     * @type {Number}
     */
    startSize: 30,

    /**
     * End size of particle
     * @type {Number}
     */
    endSize: 70,

    /**
     * Grow factor for particle
     * @type {Number}
     */
    growFactor: 0.1,

    /**
     * Current horizontal position for particle
     * @type {Number}
     */
    positionX: 0,

    /**
     * Current vertical position for particle
     * @type {Number}
     */
    positionY: 0,

    /**
     * Current horizontal particle velocity
     * @type {Number}
     */
    velocityX: 1,

    /**
     * Adds randomness to horizontal particle velocity
     * @type {Number}
     */
    velocityXRandomFactor: 0.5,

    /**
     * Current vertical velocity
     * @type {Number}
     */
    velocityY: 1,

    /**
     * Adds randomness to vertical particle velocity
     * @type {Number}
     */
    velocityYRandomFactor: 3,

    /**
     * Rotation span for particle
     * @type {Number}
     */
    rotationAngleSpan: 180,

    /**
     * Rotation speed of particle
     * @type {Number}
     */
    rotationSpeed: 0.2,

    /**
     * Start opacity of the particle
     * @type {Number}
     */
    startOpacity: 1,

    /**
     * Decline speed for opacity
     * @type {Number}
     */
    opacityDeclineSpeed: 0.01,

    /**
     * Filters to apply to asset
     * @type {Object}
     */
    filters: {},

    /**
     * Image to use for asset
     * @type {String}
     */
    image: '',

    /**
     * Render used for particles
     * @type {String}
     */
    render: 'canvas',

    /**
     * Particle prototype
     * @type {String}
     */
    particleName: 'standard'
};
```

# Building pieces.js from sources

If you prefer to build the library yourself:

Clone the repo from GitHub

```
git clone git@github.com:noahlaux/pieces.js.git
cd pieces
```

Acquire build dependencies. Make sure you have Node.js installed on your workstation. This is only needed to build pieces.js from sources. pieces.js itself has no dependency on Node.js once it is built (it works with any server technology or none). Now run:
```
npm install -g gulp
npm install
```

The first npm command sets up the popular gylp build tool. You might need to run this command with sudo if you're on Linux or Mac OS X, or in an Administrator command prompt on Windows. The second npm command fetches the remaining build dependencies.

Run the build tool

`gylp`

Now you'll find the built files `pieces.js` & `pieces.min.js` in the `dist` folder.
