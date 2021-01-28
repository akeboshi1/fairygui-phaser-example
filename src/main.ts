import "tooqinggamephaser";
import dat from "./dat.gui";
// class MyScene extends Phaser.Scene {

//     constructor(config) {
//         super(config);
//     }

//     preload() {
//         const resList = [
//             "https://osd-alpha.tooqing.com/a0826f9a84f54006aeb6ab08d92fcb63.png",
//             "https://osd-alpha.tooqing.com/309a26191b3d5ebd46dca66b7bb31147.png",
//             "https://osd-alpha.tooqing.com/1a9611fbaf28aa61c3b3cdf74ddd67df.png",
//             "https://osd-alpha.tooqing.com/ace85415422359631c305ac1309214ca.png",
//             "https://osd-alpha.tooqing.com/a0826f9a84f54006aeb6ab08d92fcb63.png",
//             "https://osd-alpha.tooqing.com/309a26191b3d5ebd46dca66b7bb31147.png",
//             "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5f61f045b50d314618a21a4d/3/5f61f045b50d314618a21a4d.png",
//             "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5f61f045b50d314618a21a4d/3/5f61f045b50d314618a21a4d.json",
//             "https://osd-alpha.tooqing.com/pixelpai/ElementNode/5fdc6dae78badd6eeba72e25/2/5fdc6dae78badd6eeba72e25.png"];
//         const now = new Date().getTime();
//         console.log("load-time", now);
//         for (let i = 0; i < resList.length; i++) {
//             // const str = "star" + i + ".jpg";
//             this.load.image('test' + i, resList[i]);
//         }
//         console.log("finish-time", new Date().getTime() - now);
//     }

//     create(data) {
//         const now = new Date().getTime();
//         console.log("init-time", now);
//         // this.add.image(0, 0, 'test1');
//         // this.add.image(1, 1, 'test0');
//         // this.add.image(2, 2, 'test2');
//         // this.add.image(3, 3, 'test3');
//         for (let i = 0; i < 30000; i++) {
//             this.add.image(i, i, 'test' + 1);
//         }
//         // for (let i = 0; i < 30; i++) {
//         //     this.add.image(i, i, `test${i}`);
//         // }
//         console.log("finish-time", new Date().getTime() - now);
//     }

// }

// var config = {
//     type: Phaser.AUTO,
//     parent: 'phaser-example',
//     width: 800,
//     height: 600
// };

// var game = new Phaser.Game(config);

// game.scene.add('myScene', MyScene, true, { x: 400, y: 300 });

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gui = null;
var emitter = null;
var move = false;
var countText = null;
var angleConfig = {
    min: 0, max: 360
};
var speedConfig = {
    min: 0, max: 200
};
var scaleConfig = {
    start: 1, end: 0, ease: 'Linear'
};
var alphaConfig = {
    start: 1, end: 0, ease: 'Linear'
};
var eases = [
    'Linear',
    'Quad.easeIn',
    'Cubic.easeIn',
    'Quart.easeIn',
    'Quint.easeIn',
    'Sine.easeIn',
    'Expo.easeIn',
    'Circ.easeIn',
    'Back.easeIn',
    'Bounce.easeIn',
    'Quad.easeOut',
    'Cubic.easeOut',
    'Quart.easeOut',
    'Quint.easeOut',
    'Sine.easeOut',
    'Expo.easeOut',
    'Circ.easeOut',
    'Back.easeOut',
    'Bounce.easeOut',
    'Quad.easeInOut',
    'Cubic.easeInOut',
    'Quart.easeInOut',
    'Quint.easeInOut',
    'Sine.easeInOut',
    'Expo.easeInOut',
    'Circ.easeInOut',
    'Back.easeInOut',
    'Bounce.easeInOut'
].sort();
var blendModes = {
    NORMAL: Phaser.BlendModes.NORMAL,
    ADD: Phaser.BlendModes.ADD,
    MULTIPLY: Phaser.BlendModes.MULTIPLY,
    SCREEN: Phaser.BlendModes.SCREEN
};
var game = new Phaser.Game(config);

function preload() {
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');
}

function create() {
    if (typeof dat === 'undefined') {
        this.add.text(16, 16, 'Please [Launch] this example.');
        return;
    }

    gui = new dat.GUI();
    emitter = this.add.particles('spark1').createEmitter({
        name: 'sparks',
        x: 400,
        y: 300,
        gravityY: 300,
        speed: speedConfig,
        angle: angleConfig,
        scale: scaleConfig,
        alpha: alphaConfig,
        blendMode: 'SCREEN'
    });

    gui.add(emitter, 'name');
    gui.add(emitter, 'on');
    gui.add(emitter, 'blendMode', blendModes).name('blend mode').onChange(function (val) { emitter.setBlendMode(Number(val)); });
    gui.add(angleConfig, 'min', 0, 360, 5).name('angle min').onChange(function () { emitter.setAngle(angleConfig); });
    gui.add(angleConfig, 'max', 0, 360, 5).name('angle max').onChange(function () { emitter.setAngle(angleConfig); });
    gui.add({ life: 1000 }, 'life', 100, 5000, 100).onChange(function (value) { emitter.setLifespan(value); });
    gui.add({ gravityX: 0 }, 'gravityX', -300, 300, 10).onChange(function (value) { emitter.setGravityX(value); });
    gui.add({ gravityY: 300 }, 'gravityY', -300, 300, 10).onChange(function (value) { emitter.setGravityY(value); });
    gui.add(speedConfig, 'min', 0, 600, 10).name('speed min').onChange(function () { emitter.setSpeed(speedConfig); });
    gui.add(speedConfig, 'max', 0, 600, 10).name('speed max').onChange(function () { emitter.setSpeed(speedConfig); });
    gui.add(scaleConfig, 'start', 0, 1, 0.1).name('scale start').onChange(function () { emitter.setScale(scaleConfig); });
    gui.add(scaleConfig, 'end', 0, 1, 0.1).name('scale end').onChange(function () { emitter.setScale(scaleConfig); });
    gui.add(scaleConfig, 'ease', eases).name('scale ease').onChange(function () { emitter.setScale(scaleConfig); });
    gui.add(alphaConfig, 'start', 0, 1, 0.1).name('alpha start').onChange(function () { emitter.setAlpha(alphaConfig); });
    gui.add(alphaConfig, 'end', 0, 1, 0.1).name('alpha end').onChange(function () { emitter.setAlpha(alphaConfig); });
    gui.add(alphaConfig, 'ease', eases).name('alpha ease').onChange(function () { emitter.setAlpha(alphaConfig); });
    gui.add(emitter, 'killAll');
    gui.add(emitter, 'pause');
    gui.add(emitter, 'resume');
    gui.add({ save: saveEmitter.bind(this) }, 'save').name('save JSON');

    this.input.on('pointermove', function (pointer) {
        if (move) {
            emitter.setPosition(pointer.x, pointer.y);
        }
    });

    this.input.on('pointerdown', function (pointer) {
        emitter.setPosition(pointer.x, pointer.y);
        move = true;
    });
    this.input.on('pointerup', function (pointer) {
        move = false;
    });

    countText = this.add.text(0, 0, 'Alive Particles');
}

function update() {
    if (!countText) { return; }

    countText.setText('Alive Particles: ' + emitter.getAliveParticleCount());
}

function saveEmitter() {
    this.load.saveJSON(emitter.toJSON(), emitter.name + '.json');
}